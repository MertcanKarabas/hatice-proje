import { Prisma } from 'generated/prisma';

export abstract class ITransactionFilterService {
  abstract buildWhereClause(userId: string, field?: string, operator?: string, value?: string): Promise<Prisma.TransactionWhereInput>;
}
