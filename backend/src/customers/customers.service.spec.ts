import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { CustomerRepository } from './repositories/customer.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { ICustomerRepository } from 'src/common/interfaces/customer.repository.interface';
import { ITransactionRepository } from 'src/common/interfaces/transaction.repository.interface';
import { TransactionRepository } from 'src/transactions/repositories/transaction.repository';
import { ICustomerFilterService } from './interfaces/customer-filter.service.interface';
import { CustomerFilterService } from './services/customer-filter.service';
import { PaymentCollectionService } from './services/payment-collection.service';

describe('CustomersService', () => {
  let service: CustomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        PrismaService,
        {
          provide: ICustomerRepository,
          useClass: CustomerRepository,
        },
        {
          provide: ITransactionRepository,
          useClass: TransactionRepository,
        },
        {
          provide: ICustomerFilterService,
          useClass: CustomerFilterService,
        },
        PaymentCollectionService,
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});