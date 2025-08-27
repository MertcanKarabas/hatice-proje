import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, TransactionType } from '@prisma/client';
export declare class CustomerBalanceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    updateCustomerBalance(customerId: string, finalAmount: Prisma.Decimal, transactionType: TransactionType, prismaTransaction: any): Promise<{
        previousBalance: Prisma.Decimal;
        newBalance: Prisma.Decimal;
    }>;
    revertCustomerBalance(customerId: string, finalAmount: Prisma.Decimal, transactionType: TransactionType, prismaTransaction: any): Promise<void>;
}
