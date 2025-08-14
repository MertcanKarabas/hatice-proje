import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransactionItemRepository } from './repositories/transaction-item.repository';
import { StockModule } from '../stock/stock.module';
import { ITransactionRepository } from 'src/common/interfaces/transaction.repository.interface';
import { ITransactionItemRepository } from 'src/common/interfaces/transaction-item.repository.interface';
import { CustomerRepository } from 'src/customers/repositories/customer.repository';
import { ITransactionFilterService } from './interfaces/transaction-filter.service.interface';
import { TransactionFilterService } from './services/transaction-filter.service';

@Module({
  imports: [StockModule],
  providers: [
    TransactionsService,
    PrismaService,
    {
      provide: ITransactionRepository,
      useClass: TransactionRepository,
    },
    {
      provide: ITransactionItemRepository,
      useClass: TransactionItemRepository,
    },
    CustomerRepository,
    {
      provide: ITransactionFilterService,
      useClass: TransactionFilterService,
    },
  ],
  controllers: [TransactionsController]
})
export class TransactionsModule {}
