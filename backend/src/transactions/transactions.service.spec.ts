import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { ITransactionRepository } from 'src/common/interfaces/transaction.repository.interface';
import { ITransactionItemRepository } from 'src/common/interfaces/transaction-item.repository.interface';
import { StockService } from 'src/stock/stock.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerRepository } from 'src/customers/repositories/customer.repository';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransactionItemRepository } from './repositories/transaction-item.repository';
import { StockRepository } from 'src/stock/repositories/stock.repository';
import { IStockRepository } from 'src/common/interfaces/stock.repository.interface';
import { ITransactionFilterService } from './interfaces/transaction-filter.service.interface';
import { TransactionFilterService } from './services/transaction-filter.service';
import { TransactionStockService } from './services/transaction-stock.service';
import { CustomerBalanceService } from './services/customer-balance.service';
import { ProfitCalculationService } from './services/profit-calculation.service';

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        PrismaService,
        StockService,
        CustomerRepository,
        {
          provide: ITransactionRepository,
          useClass: TransactionRepository,
        },
        {
          provide: ITransactionItemRepository,
          useClass: TransactionItemRepository,
        },
        {
          provide: IStockRepository,
          useClass: StockRepository,
        },
        {
          provide: ITransactionFilterService,
          useClass: TransactionFilterService,
        },
        TransactionStockService,
        CustomerBalanceService,
        ProfitCalculationService,
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});