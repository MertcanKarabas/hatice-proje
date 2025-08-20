import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, TransactionType } from 'generated/prisma';
import { ICustomerRepository } from 'src/common/interfaces/customer.repository.interface';
import { ITransactionRepository } from 'src/common/interfaces/transaction.repository.interface';
import { CreatePaymentCollectionDto, PaymentCollectionType } from '../dto/create-payment-collection.dto';

@Injectable()
export class PaymentCollectionService {
  constructor(
    private readonly customerRepository: ICustomerRepository,
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async createPaymentCollection(userId: string, dto: CreatePaymentCollectionDto) {
    const customer = await this.customerRepository.findById(dto.customerId);
    if (!customer || customer.userId !== userId) {
      throw new NotFoundException(`Customer with ID ${dto.customerId} not found or access denied.`);
    }

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
