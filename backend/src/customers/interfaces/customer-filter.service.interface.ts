import { Prisma } from 'generated/prisma';

export abstract class ICustomerFilterService {
  abstract buildWhereClause(userId: string, field?: string, operator?: string, value?: string): Promise<Prisma.CustomerWhereInput>;
}
