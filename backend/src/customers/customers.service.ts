import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreatePaymentCollectionDto } from './dto/create-payment-collection.dto';
import { ICustomerRepository } from 'src/common/interfaces/customer.repository.interface';
import { ITransactionRepository } from 'src/common/interfaces/transaction.repository.interface';
import { ICustomerFilterService } from './interfaces/customer-filter.service.interface';
import { PaymentCollectionService } from './services/payment-collection.service';

@Injectable()
export class CustomersService {
    constructor(
        private readonly customerRepository: ICustomerRepository,
        private readonly transactionRepository: ITransactionRepository,
        private readonly customerFilterService: ICustomerFilterService,
        private readonly paymentCollectionService: PaymentCollectionService,
    ) { }

    async createCustomer(userId: string, dto: CreateCustomerDto) {
        return this.customerRepository.create({
            userId,
            ...dto,
        });
    }

    async findAllByUser(userId: string, field?: string, operator?: string, value?: string) {
        const whereClause = await this.customerFilterService.buildWhereClause(userId, field, operator, value);
        return this.customerRepository.findAllByUser(whereClause);
    }

    async findOne(userId: string, customerId: string) {
        const customer = await this.customerRepository.findById(customerId);
        if (!customer || customer.userId !== userId) {
            throw new NotFoundException(`Customer with ID ${customerId} not found or access denied.`);
        }
        return customer;
    }

    
    async updateCustomer(userId: string, customerId: string, dto: CreateCustomerDto) {
        const customer = await this.findOne(userId, customerId);
        return this.customerRepository.update(customer.id, dto);
    }

    async deleteCustomer(userId: string, customerId: string) {
        const customer = await this.findOne(userId, customerId);
        await this.customerRepository.delete(customer.id);
    }

    async getTransactions(userId: string, customerId: string) {
        await this.findOne(userId, customerId); // for auth check
        return this.transactionRepository.getTransactionsByCustomer(customerId);
    }

    async createPaymentCollection(userId: string, dto: CreatePaymentCollectionDto) {
        return this.paymentCollectionService.createPaymentCollection(userId, dto);
    }
}