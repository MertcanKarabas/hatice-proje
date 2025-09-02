import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, TransactionType } from '@prisma/client';
import { ICustomerRepository } from 'src/common/interfaces/customer.repository.interface';
import { ITransactionRepository } from 'src/common/interfaces/transaction.repository.interface';
import { CreatePaymentCollectionDto, PaymentCollectionType } from '../dto/create-payment-collection.dto';
import { TransactionsService } from 'src/transactions/transactions.service';
import { CreateTransactionDto } from 'src/transactions/dto/create-transaction.dto';

@Injectable()
export class PaymentCollectionService {
  constructor(
    private readonly customerRepository: ICustomerRepository,
    private readonly transactionRepository: ITransactionRepository,
    private readonly transactionsService: TransactionsService,
  ) {}

  async createPaymentCollection(userId: string, dto: CreatePaymentCollectionDto) {
    const customer = await this.customerRepository.findById(dto.customerId);
    if (!customer || customer.userId !== userId) {
      throw new NotFoundException(`Customer with ID ${dto.customerId} not found or access denied.`);
    }

    const transactionType = dto.type === PaymentCollectionType.COLLECTION
      ? TransactionType.COLLECTION
      : TransactionType.PAYMENT;

    const createTransactionDto: CreateTransactionDto = {
        customerId: dto.customerId,
        type: transactionType,
        totalAmount: dto.amount,
        finalAmount: dto.amount,
        discountAmount: 0,
        invoiceDate: dto.date, // Use the date from the DTO
        items: [], // Payment/Collection transactions don't have items
        exchangeId: dto.exchangeId, // Pass exchangeId
    };

    const transaction = await this.transactionsService.createTransaction(userId, createTransactionDto);

    return transaction;
  }
}
