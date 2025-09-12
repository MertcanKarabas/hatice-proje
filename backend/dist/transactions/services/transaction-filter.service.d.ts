import { ITransactionFilterService } from '../interfaces/transaction-filter.service.interface';
import { Prisma } from '@prisma/client';
export declare class TransactionFilterService implements ITransactionFilterService {
    buildWhereClause(userId: string, customerId?: string, field?: string, operator?: string, value?: string, endValue?: string): Promise<Prisma.TransactionWhereInput>;
}
