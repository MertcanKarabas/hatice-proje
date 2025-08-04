import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Prisma } from 'generated/prisma';
import { IProductRepository } from 'src/common/interfaces/product.repository.interface';
import { IProductFilterService } from './interfaces/product-filter.service.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(
    private productRepository: IProductRepository,
    private productFilterService: IProductFilterService,
    private prisma: PrismaService,
  ) { }

  async findAllByUser(userId: string, field: string, operator: string, value: string) {
    const whereClause = await this.productFilterService.buildWhereClause(userId, field, operator, value);
    return this.productRepository.findAllByUser(whereClause);
  }

  async findOne(userId: string, productId: string) {
    const product = await this.productRepository.findById(productId);
    if (!product || product.userId !== userId) {
      throw new NotFoundException(`Product with ID ${productId} not found or access denied.`);
    }
    return product;
  }

  async createProduct(userId: string, dto: CreateProductDto) {
    const { components, ...productData } = dto;

    try {
      // PAKET ÜRÜN OLUŞTURMA LOGIĞI
      if (dto.isPackage) {
        if (!components || components.length === 0) {
          throw new ConflictException('Paket ürünler için bileşenler gereklidir.');
        }

        return this.prisma.$transaction(async (prisma) => {
          // 1. Bileşenlerin stoklarını transaction içinde kontrol et
          for (const component of components) {
            const componentStock = await prisma.stock.findUnique({
              where: { productId_userId: { productId: component.componentId, userId } },
              include: { product: { select: { name: true } } }
            });

            const requiredQuantity = component.quantity * dto.quantity;
            if (!componentStock || componentStock.quantity < requiredQuantity) {
              const productName = componentStock?.product.name || `ID: ${component.componentId}`;
              throw new ConflictException(`Bileşen için yetersiz stok: ${productName}`);
            }
          }

          // 2. Paket ürünü oluştur
          const newPackage = await prisma.product.create({
            data: {
              ...productData,
              userId,
              price: new Prisma.Decimal(dto.price),
              quantity: dto.quantity, // Ürünün kendi miktarını da set edelim
              packageComponents: {
                create: components.map(c => ({
                  componentId: c.componentId,
                  quantity: c.quantity,
                })),
              },
            },
          });

          // 3. Yeni paket ürün için bir stok kaydı oluştur
          await prisma.stock.create({
            data: {
              userId,
              productId: newPackage.id,
              quantity: dto.quantity,
            },
          });

          // 4. Bileşenlerin stoklarını doğru miktarda düş
          for (const component of components) {
            await prisma.stock.update({
              where: { productId_userId: { productId: component.componentId, userId } },
              data: {
                quantity: { decrement: component.quantity * dto.quantity },
              },
            });
          }

          return newPackage;
        });
      }

      // NORMAL ÜRÜN OLUŞTURMA LOGIĞI
      return this.prisma.$transaction(async (prisma) => {
        const newProduct = await prisma.product.create({
          data: {
            userId,
            ...productData,
            price: new Prisma.Decimal(dto.price),
            quantity: dto.quantity,
          },
        });

        // Yeni ürün için stok kaydı oluştur
        await prisma.stock.create({
          data: {
            userId: userId,
            productId: newProduct.id,
            quantity: dto.quantity,
          },
        });

        return newProduct;
      });

    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (
          error.code === 'P2002' &&
          Array.isArray((error.meta as { target?: unknown })?.target) &&
          ((error.meta as { target?: unknown })?.target as string[]).includes('sku')
        ) {
          throw new ConflictException('Bu stok kodu (SKU) zaten mevcut.');
        }
      }
      // ConflictException gibi beklenen hataları tekrar fırlat
      if (error instanceof ConflictException) {
        throw error;
      }
      // Diğer beklenmedik hatalar için genel bir hata fırlat
      throw new Error(`Ürün oluşturulurken bir hata oluştu: ${error.message}`);
    }
  }

  async updateProduct(
    userId: string,
    productId: string,
    dto: CreateProductDto,
  ) {
    const { components, ...productData } = dto;

    return this.prisma.$transaction(async (prisma) => {
      const existingProduct = await prisma.product.findUnique({
        where: { id: productId },
        include: { packageComponents: true },
      });

      if (!existingProduct || existingProduct.userId !== userId) {
        throw new NotFoundException(`Product with ID ${productId} not found or access denied.`);
      }

      // Restore stock from old components
      if (existingProduct.isPackage) {
        for (const component of existingProduct.packageComponents) {
          await prisma.product.update({
            where: { id: component.componentId },
            data: { quantity: { increment: component.quantity * existingProduct.quantity } },
          });
        }
      }

      // Deduct stock for new components
      if (dto.isPackage) {
        for (const component of components) {
          const product = await prisma.product.findUnique({ where: { id: component.componentId } });
          if (!product || product.quantity < component.quantity * dto.quantity) {
            throw new ConflictException(`Yetersiz stok: ${product.name}`);
          }
          await prisma.product.update({
            where: { id: component.componentId },
            data: { quantity: { decrement: component.quantity * dto.quantity } },
          });
        }
      }

      // Update the product and its components
      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: {
          ...productData,
          price: new Prisma.Decimal(dto.price),
          packageComponents: {
            deleteMany: {},
            create: dto.isPackage ? components.map(c => ({ ...c, componentId: c.componentId })) : [],
          },
        },
      });

      return updatedProduct;
    });
  }

  async deleteProduct(userId: string, productId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const existingProduct = await prisma.product.findUnique({
        where: { id: productId },
        include: { packageComponents: true, componentOfPackages: true },
      });

      if (!existingProduct || existingProduct.userId !== userId) {
        throw new NotFoundException(`Product with ID ${productId} not found or access denied.`);
      }

      if (existingProduct.componentOfPackages.length > 0) {
        throw new ConflictException('Bu ürün başka bir paketin parçası olduğu için silinemez.');
      }

      if (existingProduct.isPackage) {
        await prisma.productComponent.deleteMany({ where: { packageId: productId } });
      }

      await prisma.product.delete({ where: { id: productId } });
    });
  }
}