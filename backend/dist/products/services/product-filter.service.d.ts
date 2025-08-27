import { IProductFilterService } from '../interfaces/product-filter.service.interface';
import { Prisma } from '@prisma/client';
export declare class ProductFilterService implements IProductFilterService {
    buildWhereClause(userId: string, field?: string, operator?: string, value?: string): Promise<Prisma.ProductWhereInput>;
}
