import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, TransactionType } from '@prisma/client';
import { CurrencyService } from 'src/currency/currency.service';
export declare class CustomerBalanceService {
    private readonly prisma;
    private readonly currencyService;
    constructor(prisma: PrismaService, currencyService: CurrencyService);
    updateCustomerBalance(customerId: string, finalAmount: Prisma.Decimal, transactionType: TransactionType, prismaTransaction: any, transactionExchangeId?: string): Promise<{
        previousBalance: Prisma.Decimal;
        newBalance: Prisma.Decimal;
    }>;
    revertCustomerBalance(customerId: string, finalAmount: Prisma.Decimal, transactionType: TransactionType, prismaTransaction: any, transactionExchangeId?: string): Promise<void>;
}
