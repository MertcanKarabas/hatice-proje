import { Injectable } from '@nestjs/common';
import { Stock } from '@prisma/client';
import { BaseRepository } from '../../common/database/repositories/base.repository';
import { IStockRepository } from '../../common/interfaces/stock.repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StockRepository extends BaseRepository<Stock> implements IStockRepository {
  constructor(prisma: PrismaService) {
    super(prisma, 'stock');
  }

  async findStockByProductAndUser(userId: string, productId: string): Promise<Stock | null> {
    return this.prisma.stock.findFirst({
      where: {
        userId,
        productId,
      },
    });
  }

  async updateStockQuantity(stockId: string, newQuantity: number): Promise<Stock> {
    return this.prisma.stock.update({
      where: { id: stockId },
      data: { quantity: newQuantity },
    });
  }

  async createStock(userId: string, productId: string, quantity: number): Promise<Stock> {
    return this.prisma.stock.create({
      data: {
        userId,
        productId,
        quantity,
      },
    });
  }
}
