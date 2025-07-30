import { Transaction } from 'generated/prisma';
import { BaseRepository } from '../../common/database/repositories/base.repository';
import { ITransactionRepository } from '../../common/interfaces/transaction.repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class TransactionRepository extends BaseRepository<Transaction> implements ITransactionRepository {
    constructor(prisma: PrismaService);
    getTransactionsByUser(userId: string): Promise<Transaction[]>;
    getTransactionById(userId: string, transactionId: string): Promise<Transaction | null>;
}
