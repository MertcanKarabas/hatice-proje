import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { CustomerRepository } from './repositories/customer.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { ICustomerRepository } from 'src/common/interfaces/customer.repository.interface';

@Module({
    providers: [
        CustomersService,
        PrismaService,
        {
            provide: ICustomerRepository,
            useClass: CustomerRepository,
        },
    ],
    controllers: [CustomersController],
    exports: [CustomersService],
})
export class CustomersModule { }