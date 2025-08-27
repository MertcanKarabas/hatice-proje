import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionStockService {
  constructor(private readonly prisma: PrismaService) {}

  async checkStockAvailability(
    userId: string,
    items: { productId: string; quantity: number }[],
    prismaTransaction: any,
  ): Promise<void> {
    for (const item of items) {
      const stock = await prismaTransaction.stock.findFirst({ where: { productId: item.productId, userId } });
      if (!stock || stock.quantity < item.quantity) {
        const product = await prismaTransaction.product.findUnique({ where: { id: item.productId } });
        throw new BadRequestException(`Insufficient stock: ${product?.name ?? item.productId}`);
      }
    }
  }

  async updateStockForTransaction(
    userId: string,
    items: { productId: string; quantity: number }[],
    type: 'SALE' | 'PURCHASE',
    prismaTransaction: any,
  ): Promise<void> {
    for (const item of items) {
      const existingStock = await prismaTransaction.stock.findFirst({
        where: { productId: item.productId, userId },
      });

      if (existingStock) {
        const newQuantity = type === 'PURCHASE'
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
        if (type === 'SALE') {
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

  async revertStockForTransaction(
    userId: string,
    items: { productId: string; quantity: number }[],
    type: 'SALE' | 'PURCHASE',
    prismaTransaction: any,
  ): Promise<void> {
    for (const item of items) {
      const existingStock = await prismaTransaction.stock.findFirst({
        where: { productId: item.productId, userId },
      });

      if (existingStock) {
        const newQuantity = type === 'SALE'
          ? existingStock.quantity + item.quantity
          : existingStock.quantity - item.quantity;

        await prismaTransaction.stock.update({
          where: { id: existingStock.id },
          data: { quantity: newQuantity },
        });
      }
    }
  }
}
