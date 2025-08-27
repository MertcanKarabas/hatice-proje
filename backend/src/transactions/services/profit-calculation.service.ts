import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProfitCalculationService {
  constructor(private readonly prisma: PrismaService) {}

  async calculateProfit(
    items: { productId: string; quantity: number; price: number }[],
    prismaTransaction: any,
  ): Promise<Prisma.Decimal> {
    let profit = new Prisma.Decimal(0);
    for (const item of items) {
      const product = await prismaTransaction.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found.`);
      }
      const itemProfit = new Prisma.Decimal(item.price).minus(product.price).times(item.quantity);

      if (product.currency === 'TRY') {
        profit = profit.plus(itemProfit);
      } else {
        const exchangeRate = await prismaTransaction.exchange.findUnique({ where: { code: product.currency } });
        if (!exchangeRate) {
          throw new NotFoundException(`Exchange rate for ${product.currency} not found.`);
        }
        profit = profit.plus(itemProfit.times(exchangeRate.rate));
      }
    }
    return profit;
  }
}
