import { Injectable } from '@nestjs/common';
import { Transaction, Prisma } from '@prisma/client';
import { BaseRepository } from '../../common/database/repositories/base.repository';
import { ITransactionRepository } from '../../common/interfaces/transaction.repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionRepository extends BaseRepository<Transaction> implements ITransactionRepository {
  constructor(prisma: PrismaService) {
    super(prisma, 'transaction');
  }

  async getTransactionsByUser(whereClause: Prisma.TransactionWhereInput): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: whereClause,
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
        discounts: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getTransactionById(userId: string, transactionId: string): Promise<Transaction | null> {
    return this.prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId,
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
        discounts: true,
      },
    });
  }

  async getTransactionsByCustomer(customerId: string): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: { customerId },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
        discounts: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}