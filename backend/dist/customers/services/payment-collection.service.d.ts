import { Prisma } from '@prisma/client';
import { ICustomerRepository } from 'src/common/interfaces/customer.repository.interface';
import { ITransactionRepository } from 'src/common/interfaces/transaction.repository.interface';
import { CreatePaymentCollectionDto } from '../dto/create-payment-collection.dto';
export declare class PaymentCollectionService {
    private readonly customerRepository;
    private readonly transactionRepository;
    constructor(customerRepository: ICustomerRepository, transactionRepository: ITransactionRepository);
    createPaymentCollection(userId: string, dto: CreatePaymentCollectionDto): Promise<{
        currency: string | null;
        id: string;
        userId: string;
        vatRate: number | null;
        type: import(".prisma/client").$Enums.TransactionType;
        customerId: string | null;
        discountAmount: Prisma.Decimal;
        invoiceDate: Date | null;
        dueDate: Date | null;
        customerPreviousBalance: Prisma.Decimal | null;
        customerNewBalance: Prisma.Decimal | null;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: Prisma.Decimal;
        finalAmount: Prisma.Decimal;
        status: import(".prisma/client").$Enums.TransactionStatus;
        profit: Prisma.Decimal | null;
    }>;
}
