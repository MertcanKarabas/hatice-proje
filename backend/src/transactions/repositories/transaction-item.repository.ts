import { Injectable } from '@nestjs/common';
import { TransactionItem, Prisma } from '@prisma/client';
import { BaseRepository } from '../../common/database/repositories/base.repository';
import { ITransactionItemRepository } from '../../common/interfaces/transaction-item.repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionItemRepository extends BaseRepository<TransactionItem> implements ITransactionItemRepository {
  constructor(prisma: PrismaService) {
    super(prisma, 'transactionItem');
  }

  async createMany(data: Prisma.TransactionItemCreateManyInput[]): Promise<Prisma.BatchPayload> {
    return this.prisma.transactionItem.createMany({ data });
  }
}
