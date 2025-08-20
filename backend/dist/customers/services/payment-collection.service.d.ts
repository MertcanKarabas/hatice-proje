import { Prisma } from 'generated/prisma';
import { ICustomerRepository } from 'src/common/interfaces/customer.repository.interface';
import { ITransactionRepository } from 'src/common/interfaces/transaction.repository.interface';
import { CreatePaymentCollectionDto } from '../dto/create-payment-collection.dto';
export declare class PaymentCollectionService {
    private readonly customerRepository;
    private readonly transactionRepository;
    constructor(customerRepository: ICustomerRepository, transactionRepository: ITransactionRepository);
    createPaymentCollection(userId: string, dto: CreatePaymentCollectionDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: Prisma.Decimal;
        discountAmount: Prisma.Decimal;
        finalAmount: Prisma.Decimal;
        type: import("generated/prisma").$Enums.TransactionType;
        status: import("generated/prisma").$Enums.TransactionStatus;
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
