import { ITransactionFilterService } from '../interfaces/transaction-filter.service.interface';
import { Prisma } from 'generated/prisma';
export declare class TransactionFilterService implements ITransactionFilterService {
    buildWhereClause(userId: string, field?: string, operator?: string, value?: string): Promise<Prisma.TransactionWhereInput>;
}
