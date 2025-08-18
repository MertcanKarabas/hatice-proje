import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, TransactionType } from 'generated/prisma';
export declare class CustomerBalanceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    updateCustomerBalance(customerId: string, finalAmount: Prisma.Decimal, transactionType: TransactionType, prismaTransaction: any): Promise<void>;
    revertCustomerBalance(customerId: string, finalAmount: Prisma.Decimal, transactionType: TransactionType, prismaTransaction: any): Promise<void>;
}
