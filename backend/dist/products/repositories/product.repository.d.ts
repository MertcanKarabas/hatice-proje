import { Product, Prisma } from 'generated/prisma';
import { BaseRepository } from '../../common/database/repositories/base.repository';
import { IProductRepository } from '../../common/interfaces/product.repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class ProductRepository extends BaseRepository<Product> implements IProductRepository {
    constructor(prisma: PrismaService);
    findAllByUser(whereClause: Prisma.ProductWhereInput): Promise<Product[]>;
    findById(id: string): Promise<Product | null>;
}
