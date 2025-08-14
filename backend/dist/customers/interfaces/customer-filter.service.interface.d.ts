import { Prisma } from 'generated/prisma';
export declare abstract class ICustomerFilterService {
    abstract buildWhereClause(userId: string, field?: string, operator?: string, value?: string): Promise<Prisma.CustomerWhereInput>;
}
