import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ITransactionRepository } from 'src/common/interfaces/transaction.repository.interface';
import { ITransactionItemRepository } from 'src/common/interfaces/transaction-item.repository.interface';
import { StockService } from 'src/stock/stock.service';
import { Prisma } from 'generated/prisma';
export declare class TransactionsService {
    private readonly transactionRepository;
    private readonly transactionItemRepository;
    private readonly stockService;
    constructor(transactionRepository: ITransactionRepository, transactionItemRepository: ITransactionItemRepository, stockService: StockService);
    createTransaction(userId: string, dto: CreateTransactionDto): Promise<{
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
    }>;
    getTransactionsByUser(userId: string): Promise<{
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
    }[]>;
    getTransactionById(userId: string, transactionId: string): Promise<{
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
    }>;
}
