import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerRepository } from 'src/customers/repositories/customer.repository';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransactionItemRepository } from './repositories/transaction-item.repository';
import { StockService } from 'src/stock/stock.service';
import { StockRepository } from 'src/stock/repositories/stock.repository';
import { ITransactionRepository } from 'src/common/interfaces/transaction.repository.interface';
import { ITransactionItemRepository } from 'src/common/interfaces/transaction-item.repository.interface';
import { IStockRepository } from 'src/common/interfaces/stock.repository.interface';
import { ITransactionFilterService } from './interfaces/transaction-filter.service.interface';
import { TransactionFilterService } from './services/transaction-filter.service';
import { TransactionStockService } from './services/transaction-stock.service';
import { CustomerBalanceService } from './services/customer-balance.service';
import { ProfitCalculationService } from './services/profit-calculation.service';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        TransactionsService,
        PrismaService,
        CustomerRepository,
        StockService,
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

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});