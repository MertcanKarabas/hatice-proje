import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { CustomerRepository } from './repositories/customer.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { ICustomerRepository } from 'src/common/interfaces/customer.repository.interface';
import { ITransactionRepository } from 'src/common/interfaces/transaction.repository.interface';
import { TransactionRepository } from 'src/transactions/repositories/transaction.repository';
import { ICustomerFilterService } from './interfaces/customer-filter.service.interface';
import { CustomerFilterService } from './services/customer-filter.service';

@Module({
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
    ],
    controllers: [CustomersController],
    exports: [CustomersService],
})
export class CustomersModule { }
