import { Prisma } from '@prisma/client';

export abstract class ITransactionFilterService {
  abstract buildWhereClause(userId: string, customerId?: string, field?: string, operator?: string, value?: string, endValue?: string): Promise<Prisma.TransactionWhereInput>;
}
