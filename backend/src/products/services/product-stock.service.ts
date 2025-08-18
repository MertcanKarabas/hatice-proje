import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { Prisma } from 'generated/prisma';

@Injectable()
export class ProductStockService {
  constructor(private readonly prisma: PrismaService) {}

  async checkAndDecrementStockForPackageCreation(
    userId: string,
    components: { componentId: string; quantity: number }[],
    packageQuantity: number,
  ): Promise<void> {
    for (const component of components) {
      const componentStock = await this.prisma.stock.findUnique({
        where: { productId_userId: { productId: component.componentId, userId } },
        include: { product: { select: { name: true } } },
      });

      const requiredQuantity = component.quantity * packageQuantity;
      if (!componentStock || componentStock.quantity < requiredQuantity) {
        const productName = componentStock?.product.name || `ID: ${component.componentId}`;
        throw new ConflictException(`Insufficient stock for component: ${productName}`);
      }
    }

    for (const component of components) {
      await this.prisma.stock.update({
        where: { productId_userId: { productId: component.componentId, userId } },
        data: {
          quantity: { decrement: component.quantity * packageQuantity },
        },
      });
    }
  }

  async createStockForNewProduct(userId: string, productId: string, quantity: number): Promise<void> {
    await this.prisma.stock.create({
      data: {
        userId,
        productId,
        quantity,
      },
    });
  }

  async restoreStockForOldPackageComponents(
    existingProduct: any, // TODO: Define a proper type for existingProduct
    prismaTransaction: any, // TODO: Define a proper type for prismaTransaction
  ): Promise<void> {
    if (existingProduct.isPackage) {
      for (const component of existingProduct.packageComponents) {
        await prismaTransaction.product.update({
          where: { id: component.componentId },
          data: { quantity: { increment: component.quantity * existingProduct.quantity } },
        });
      }
    }
  }

  async deductStockForNewPackageComponents(
    userId: string,
    components: { componentId: string; quantity: number }[],
    packageQuantity: number,
    prismaTransaction: any, // TODO: Define a proper type for prismaTransaction
  ): Promise<void> {
    for (const component of components) {
      const product = await prismaTransaction.product.findUnique({ where: { id: component.componentId } });
      if (!product || product.quantity < component.quantity * packageQuantity) {
        throw new ConflictException(`Insufficient stock: ${product.name}`);
      }
      await prismaTransaction.product.update({
        where: { id: component.componentId },
        data: { quantity: { decrement: component.quantity * packageQuantity } },
      });
    }
  }

  async revertStockForTransaction(
    userId: string,
    items: { productId: string; quantity: number }[],
    transactionType: 'SALE' | 'PURCHASE',
    prismaTransaction: any, // TODO: Define a proper type for prismaTransaction
  ): Promise<void> {
    for (const item of items) {
      const existingStock = await prismaTransaction.stock.findFirst({
        where: { productId: item.productId, userId },
      });

      if (existingStock) {
        const newQuantity = transactionType === 'SALE'
          ? existingStock.quantity + item.quantity
          : existingStock.quantity - item.quantity;

        await prismaTransaction.stock.update({
          where: { id: existingStock.id },
          data: { quantity: newQuantity },
        });
      }
    }
  }

  async updateStockForTransaction(
    userId: string,
    items: { productId: string; quantity: number }[],
    transactionType: 'SALE' | 'PURCHASE',
    prismaTransaction: any, // TODO: Define a proper type for prismaTransaction
  ): Promise<void> {
    for (const item of items) {
      const existingStock = await prismaTransaction.stock.findFirst({
        where: { productId: item.productId, userId },
      });

      if (existingStock) {
        const newQuantity = transactionType === 'PURCHASE'
          ? existingStock.quantity + item.quantity
          : existingStock.quantity - item.quantity;

        if (newQuantity < 0) {
          throw new BadRequestException(`Insufficient stock for product ${item.productId}`);
        }

        await prismaTransaction.stock.update({
          where: { id: existingStock.id },
          data: { quantity: newQuantity },
        });
      } else {
        if (transactionType === 'SALE') {
          throw new BadRequestException(`Stock not found for product ${item.productId}`);
        }
        await prismaTransaction.stock.create({
          data: {
            userId,
            productId: item.productId,
            quantity: item.quantity,
          },
        });
      }
    }
  }
}
