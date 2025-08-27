import { Injectable, BadRequestException } from '@nestjs/common';
import { Stock } from '@prisma/client';
import { IStockRepository } from 'src/common/interfaces/stock.repository.interface';

@Injectable()
export class StockService {
  constructor(private readonly stockRepository: IStockRepository) { }

  async updateStock(
    userId: string,
    productId: string,
    quantity: number,
    type: 'SALE' | 'PURCHASE',
  ): Promise<Stock> {
    const existingStock = await this.stockRepository.findStockByProductAndUser(userId, productId);

    if (existingStock) {
      const newQuantity = type === 'PURCHASE'
        ? existingStock.quantity + quantity
        : existingStock.quantity - quantity;

      if (newQuantity < 0) {
        throw new BadRequestException(`Insufficient stock for product ${productId}`);
      }

      return this.stockRepository.updateStockQuantity(existingStock.id, newQuantity);
    } else {
      if (type === 'SALE') {
        throw new BadRequestException(`Stock not found for product ${productId}`);
      }
      return this.stockRepository.createStock(userId, productId, quantity);
    }
  }
}
