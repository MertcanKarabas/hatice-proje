import { Product, Prisma } from '@prisma/client';
import { IBaseRepository } from './base.repository.interface';

export abstract class IProductRepository implements IBaseRepository<Product> {
  abstract findAllByUser(whereClause: Prisma.ProductWhereInput): Promise<Product[]>;
  abstract findById(id: string): Promise<Product | null>;
  abstract findAll(): Promise<Product[]>;
  abstract create(data: Partial<Product>): Promise<Product>;
  abstract update(id: string, data: Partial<Product>): Promise<Product>;
  abstract delete(id: string): Promise<void>;
}
