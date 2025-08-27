import { Prisma } from '@prisma/client';
export declare abstract class IProductFilterService {
    abstract buildWhereClause(userId: string, field?: string, operator?: string, value?: string): Promise<Prisma.ProductWhereInput>;
}
