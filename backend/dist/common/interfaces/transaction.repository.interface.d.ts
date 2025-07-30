import { Transaction } from 'generated/prisma';
import { IBaseRepository } from './base.repository.interface';
export declare abstract class ITransactionRepository implements IBaseRepository<Transaction> {
    abstract getTransactionsByUser(userId: string): Promise<Transaction[]>;
    abstract getTransactionById(userId: string, transactionId: string): Promise<Transaction | null>;
    abstract findById(id: string): Promise<Transaction | null>;
    abstract findAll(): Promise<Transaction[]>;
    abstract create(data: Partial<Transaction>): Promise<Transaction>;
    abstract update(id: string, data: Partial<Transaction>): Promise<Transaction>;
    abstract delete(id: string): Promise<void>;
}
