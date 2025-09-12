import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, TransactionType } from '@prisma/client';
import { CurrencyService } from 'src/currency/currency.service';

@Injectable()
export class CustomerBalanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currencyService: CurrencyService,
  ) {}

  async updateCustomerBalance(
    customerId: string,
    finalAmount: Prisma.Decimal,
    transactionType: TransactionType,
    prismaTransaction: any,
    transactionCurrencyCode?: string, // Renamed parameter
  ): Promise<{ previousBalance: Prisma.Decimal; newBalance: Prisma.Decimal }> {
    if (!customerId) return { previousBalance: new Prisma.Decimal(0), newBalance: new Prisma.Decimal(0) };

    const customer = await prismaTransaction.customer.findUnique({
      where: { id: customerId },
      include: { exchange: true },
    });

    if (customer) {
      const customerBalanceCurrencyCode = customer.exchange?.code || 'TRY';
      const effectiveTransactionCurrencyCode = transactionCurrencyCode || 'TRY';

      let convertedAmount = finalAmount;
      if (effectiveTransactionCurrencyCode !== customerBalanceCurrencyCode) {
        convertedAmount = await this.currencyService.convertAmount(
          finalAmount,
          effectiveTransactionCurrencyCode,
          customerBalanceCurrencyCode,
        );
      }

      const previousBalance = new Prisma.Decimal(customer.balance);
      let newBalance = new Prisma.Decimal(customer.balance);

      if (transactionType === TransactionType.SALE) {
        newBalance = newBalance.plus(convertedAmount);
      } else if (transactionType === TransactionType.PURCHASE) {
        newBalance = newBalance.minus(convertedAmount);
      } else if (transactionType === TransactionType.COLLECTION) {
        newBalance = newBalance.minus(convertedAmount);
      } else if (transactionType === TransactionType.PAYMENT) {
        newBalance = newBalance.plus(convertedAmount);
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
    transactionCurrencyCode?: string, // Renamed parameter
  ): Promise<void> {
    if (!customerId) return;

    const customer = await prismaTransaction.customer.findUnique({
      where: { id: customerId },
      include: { exchange: true },
    });

    if (customer) {
      const customerBalanceCurrencyCode = customer.exchange?.code || 'TRY';
      const effectiveTransactionCurrencyCode = transactionCurrencyCode || 'TRY';

      let convertedAmount = finalAmount;
      if (effectiveTransactionCurrencyCode !== customerBalanceCurrencyCode) {
        convertedAmount = await this.currencyService.convertAmount(
          finalAmount,
          effectiveTransactionCurrencyCode,
          customerBalanceCurrencyCode,
        );
      }

      let oldBalance = new Prisma.Decimal(customer.balance);
      if (transactionType === TransactionType.SALE) {
        oldBalance = oldBalance.minus(convertedAmount);
      } else if (transactionType === TransactionType.PURCHASE) {
        oldBalance = oldBalance.plus(convertedAmount);
      } else if (transactionType === TransactionType.COLLECTION) {
        oldBalance = oldBalance.plus(convertedAmount);
      } else if (transactionType === TransactionType.PAYMENT) {
        oldBalance = oldBalance.minus(convertedAmount);
      }
      await prismaTransaction.customer.update({ where: { id: customerId }, data: { balance: oldBalance } });
    }
  }
}

