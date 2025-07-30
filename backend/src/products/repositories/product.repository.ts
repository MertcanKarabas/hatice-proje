import { Injectable } from '@nestjs/common';
import { Product, Prisma } from 'generated/prisma';
import { BaseRepository } from '../../common/database/repositories/base.repository';
import { IProductRepository } from '../../common/interfaces/product.repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductRepository extends BaseRepository<Product> implements IProductRepository {
  constructor(prisma: PrismaService) {
    super(prisma, 'product');
  }

  async findAllByUser(whereClause: Prisma.ProductWhereInput): Promise<Product[]> {
    return this.prisma.product.findMany({ where: whereClause });
  }
}