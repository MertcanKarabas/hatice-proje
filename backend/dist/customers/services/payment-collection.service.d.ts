import { Prisma } from '@prisma/client';
import { ICustomerRepository } from 'src/common/interfaces/customer.repository.interface';
import { ITransactionRepository } from 'src/common/interfaces/transaction.repository.interface';
import { CreatePaymentCollectionDto } from '../dto/create-payment-collection.dto';
import { TransactionsService } from 'src/transactions/transactions.service';
export declare class PaymentCollectionService {
    private readonly customerRepository;
    private readonly transactionRepository;
    private readonly transactionsService;
    constructor(customerRepository: ICustomerRepository, transactionRepository: ITransactionRepository, transactionsService: TransactionsService);
    createPaymentCollection(userId: string, dto: CreatePaymentCollectionDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: Prisma.Decimal;
        discountAmount: Prisma.Decimal;
        finalAmount: Prisma.Decimal;
        type: import(".prisma/client").$Enums.TransactionType;
        status: import(".prisma/client").$Enums.TransactionStatus;
        customerId: string | null;
        invoiceDate: Date | null;
        dueDate: Date | null;
        vatRate: number | null;
        currency: string | null;
        profit: Prisma.Decimal | null;
        customerPreviousBalance: Prisma.Decimal | null;
        customerNewBalance: Prisma.Decimal | null;
    }>;
}
