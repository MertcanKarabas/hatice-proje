import { TransactionItem, Prisma } from 'generated/prisma';
import { BaseRepository } from '../../common/database/repositories/base.repository';
import { ITransactionItemRepository } from '../../common/interfaces/transaction-item.repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class TransactionItemRepository extends BaseRepository<TransactionItem> implements ITransactionItemRepository {
    constructor(prisma: PrismaService);
    createMany(data: Prisma.TransactionItemCreateManyInput[]): Promise<Prisma.BatchPayload>;
}
