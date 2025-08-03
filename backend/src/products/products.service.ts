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

    if (dto.isPackage && (!components || components.length === 0)) {
      throw new ConflictException('Paket ürünler için bileşenler gereklidir.');
    }

    try {
      if (dto.isPackage) {
        // Check stock for all components
        for (const component of components) {
          const product = await this.productRepository.findById(component.componentId);
          if (!product || product.quantity < component.quantity * dto.quantity) {
            throw new ConflictException(`Yetersiz stok: ${product.name}`);
          }
        }

        // Create the package product and its components
        return this.prisma.$transaction(async (prisma) => {
          const newPackage = await prisma.product.create({
            data: {
              ...productData,
              userId,
              price: new Prisma.Decimal(dto.price),
              packageComponents: {
                create: components.map(c => ({ ...c, componentId: c.componentId }))
              }
            }
          });

          // Update stock for each component
          for (const component of components) {
            await prisma.stock.updateMany({
              where: { productId: component.componentId, userId },
              data: { quantity: { decrement: component.quantity } },
            });
          }

          return newPackage;
        });
      }

      // Create a regular product
      return await this.productRepository.create({
        userId,
        ...productData,
        price: new Prisma.Decimal(dto.price),
      });
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('sku')) {
        throw new ConflictException('Bu stok kodu (SKU) zaten mevcut.');
      }
      throw error;
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