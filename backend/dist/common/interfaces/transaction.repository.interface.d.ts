import { Transaction, Prisma } from '@prisma/client';
import { IBaseRepository } from './base.repository.interface';
export declare abstract class ITransactionRepository implements IBaseRepository<Transaction> {
    abstract getTransactionsByUser(whereClause: Prisma.TransactionWhereInput): Promise<Transaction[]>;
    abstract getTransactionById(userId: string, transactionId: string): Promise<Transaction | null>;
    abstract getTransactionsByCustomer(customerId: string): Promise<Transaction[]>;
    abstract findById(id: string): Promise<Transaction | null>;
    abstract findAll(): Promise<Transaction[]>;
    abstract create(data: Partial<Transaction>): Promise<Transaction>;
    abstract update(id: string, data: Partial<Transaction>): Promise<Transaction>;
    abstract delete(id: string): Promise<void>;
}
