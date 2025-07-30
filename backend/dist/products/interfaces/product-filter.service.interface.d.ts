import { Prisma } from 'generated/prisma';
export declare abstract class IProductFilterService {
    abstract buildWhereClause(userId: string, field?: string, operator?: string, value?: string): Promise<Prisma.ProductWhereInput>;
}
