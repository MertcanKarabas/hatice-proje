import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, TransactionType } from '@prisma/client';

@Injectable()
export class CustomerBalanceService {
  constructor(private readonly prisma: PrismaService) {}

  async updateCustomerBalance(
    customerId: string,
    finalAmount: Prisma.Decimal,
    transactionType: TransactionType,
    prismaTransaction: any,
  ): Promise<{ previousBalance: Prisma.Decimal; newBalance: Prisma.Decimal }> {
    if (!customerId) return { previousBalance: new Prisma.Decimal(0), newBalance: new Prisma.Decimal(0) };

    const customer = await prismaTransaction.customer.findUnique({ where: { id: customerId } });
    if (customer) {
      const previousBalance = new Prisma.Decimal(customer.balance);
      let newBalance = new Prisma.Decimal(customer.balance);
      if (transactionType === TransactionType.SALE) {
        newBalance = newBalance.plus(finalAmount);
      } else if (transactionType === TransactionType.PURCHASE) {
        newBalance = newBalance.minus(finalAmount);
      }
      await prismaTransaction.customer.update({ where: { id: customerId }, data: { balance: newBalance } });
      return { previousBalance, newBalance };
    }
    return { previousBalance: new Prisma.Decimal(0), newBalance: new Prisma.Decimal(0) };
  }

  async revertCustomerBalance(
    customerId: string,
    finalAmount: Prisma.Decimal,
    transactionType: TransactionType,
    prismaTransaction: any,
  ): Promise<void> {
    if (!customerId) return;

    const customer = await prismaTransaction.customer.findUnique({ where: { id: customerId } });
    if (customer) {
      let oldBalance = new Prisma.Decimal(customer.balance);
      if (transactionType === TransactionType.SALE) {
        oldBalance = oldBalance.minus(finalAmount);
      } else if (transactionType === TransactionType.PURCHASE) {
        oldBalance = oldBalance.plus(finalAmount);
      }
      await prismaTransaction.customer.update({ where: { id: customerId }, data: { balance: oldBalance } });
    }
  }
}
