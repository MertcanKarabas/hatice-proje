import { Prisma } from '@prisma/client';
export declare abstract class ITransactionFilterService {
    abstract buildWhereClause(userId: string, field?: string, operator?: string, value?: string, endValue?: string): Promise<Prisma.TransactionWhereInput>;
}
