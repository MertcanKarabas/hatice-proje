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
import { PaymentCollectionService } from './services/payment-collection.service';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
    imports: [TransactionsModule],
    providers: [
        CustomersService,
        PrismaService,
        {
            provide: ICustomerRepository,
            useClass: CustomerRepository,
        },
        { // This is needed because PaymentCollectionService depends on it
            provide: ITransactionRepository,
            useClass: TransactionRepository,
        },
        {
            provide: ICustomerFilterService,
            useClass: CustomerFilterService,
        },
        PaymentCollectionService,
    ],
    controllers: [CustomersController],
    exports: [CustomersService],
})
export class CustomersModule { }