import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    create(req: any, dto: CreateTransactionDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        discountAmount: import("@prisma/client/runtime/library").Decimal;
        finalAmount: import("@prisma/client/runtime/library").Decimal;
        type: import(".prisma/client").$Enums.TransactionType;
        status: import(".prisma/client").$Enums.TransactionStatus;
        customerId: string | null;
        invoiceDate: Date | null;
        dueDate: Date | null;
        vatRate: number | null;
        exchangeId: string | null;
        profit: import("@prisma/client/runtime/library").Decimal | null;
        customerPreviousBalance: import("@prisma/client/runtime/library").Decimal | null;
        customerNewBalance: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    findAll(req: any, field?: string, operator?: string, value?: string, endValue?: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        discountAmount: import("@prisma/client/runtime/library").Decimal;
        finalAmount: import("@prisma/client/runtime/library").Decimal;
        type: import(".prisma/client").$Enums.TransactionType;
        status: import(".prisma/client").$Enums.TransactionStatus;
        customerId: string | null;
        invoiceDate: Date | null;
        dueDate: Date | null;
        vatRate: number | null;
        exchangeId: string | null;
        profit: import("@prisma/client/runtime/library").Decimal | null;
        customerPreviousBalance: import("@prisma/client/runtime/library").Decimal | null;
        customerNewBalance: import("@prisma/client/runtime/library").Decimal | null;
    }[]>;
    getTransactionById(req: any, id: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        discountAmount: import("@prisma/client/runtime/library").Decimal;
        finalAmount: import("@prisma/client/runtime/library").Decimal;
        type: import(".prisma/client").$Enums.TransactionType;
        status: import(".prisma/client").$Enums.TransactionStatus;
        customerId: string | null;
        invoiceDate: Date | null;
        dueDate: Date | null;
        vatRate: number | null;
        exchangeId: string | null;
        profit: import("@prisma/client/runtime/library").Decimal | null;
        customerPreviousBalance: import("@prisma/client/runtime/library").Decimal | null;
        customerNewBalance: import("@prisma/client/runtime/library").Decimal | null;
    } | {
        message: string;
    }>;
    getProfitLast30Days(req: any): Promise<{
        profit: import("@prisma/client/runtime/library").Decimal;
    }>;
    update(req: any, id: string, dto: CreateTransactionDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        discountAmount: import("@prisma/client/runtime/library").Decimal;
        finalAmount: import("@prisma/client/runtime/library").Decimal;
        type: import(".prisma/client").$Enums.TransactionType;
        status: import(".prisma/client").$Enums.TransactionStatus;
        customerId: string | null;
        invoiceDate: Date | null;
        dueDate: Date | null;
        vatRate: number | null;
        exchangeId: string | null;
        profit: import("@prisma/client/runtime/library").Decimal | null;
        customerPreviousBalance: import("@prisma/client/runtime/library").Decimal | null;
        customerNewBalance: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
