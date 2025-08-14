import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreatePaymentCollectionDto, PaymentCollectionType } from './dto/create-payment-collection.dto';
import { ICustomerRepository } from 'src/common/interfaces/customer.repository.interface';
import { ITransactionRepository } from 'src/common/interfaces/transaction.repository.interface';
import { ICustomerFilterService } from './interfaces/customer-filter.service.interface';
import { Prisma, TransactionType } from 'generated/prisma';

@Injectable()
export class CustomersService {
    constructor(
        private readonly customerRepository: ICustomerRepository,
        private readonly transactionRepository: ITransactionRepository,
        private readonly customerFilterService: ICustomerFilterService,
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
        const customer = await this.findOne(userId, dto.customerId);
        const amount = new Prisma.Decimal(dto.amount);

        const transactionType = dto.type === PaymentCollectionType.COLLECTION
            ? TransactionType.COLLECTION
            : TransactionType.PAYMENT;

        // Update customer balance
        const newBalance = dto.type === PaymentCollectionType.COLLECTION
            ? customer.balance.minus(amount)
            : customer.balance.plus(amount);
        
        await this.customerRepository.update(customer.id, { balance: newBalance });

        // Create a transaction record
        const transaction = await this.transactionRepository.create({
            userId,
            customerId: dto.customerId,
            type: transactionType,
            totalAmount: amount,
            finalAmount: amount,
            discountAmount: new Prisma.Decimal(0),
        });

        return transaction;
    }
}
