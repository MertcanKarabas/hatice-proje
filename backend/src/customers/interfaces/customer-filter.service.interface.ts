import { Prisma } from '@prisma/client';

export abstract class ICustomerFilterService {
  abstract buildWhereClause(userId: string, field?: string, operator?: string, value?: string): Promise<Prisma.CustomerWhereInput>;
}
