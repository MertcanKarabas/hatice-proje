import { TransactionItem, Prisma } from 'generated/prisma';
import { IBaseRepository } from './base.repository.interface';

export abstract class ITransactionItemRepository implements IBaseRepository<TransactionItem> {
  abstract createMany(data: Prisma.TransactionItemCreateManyInput[]): Promise<Prisma.BatchPayload>;
  abstract findById(id: string): Promise<TransactionItem | null>;
  abstract findAll(): Promise<TransactionItem[]>;
  abstract create(data: Partial<TransactionItem>): Promise<TransactionItem>;
  abstract update(id: string, data: Partial<TransactionItem>): Promise<TransactionItem>;
  abstract delete(id: string): Promise<void>;
}
