import { Customer, Prisma } from '@prisma/client';
import { IBaseRepository } from './base.repository.interface';

export abstract class ICustomerRepository implements IBaseRepository<Customer> {
  abstract findAllByUser(whereClause: Prisma.CustomerWhereInput): Promise<Customer[]>;
  abstract findById(id: string): Promise<Customer | null>;
  abstract findAll(): Promise<Customer[]>;
  abstract create(data: Partial<Customer>): Promise<Customer>;
  abstract update(id: string, data: Partial<Customer>): Promise<Customer>;
  abstract delete(id: string): Promise<void>;
}
