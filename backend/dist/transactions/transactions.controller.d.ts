import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    create(req: any, dto: CreateTransactionDto): Promise<{
        currency: string | null;
        id: string;
        userId: string;
        vatRate: number | null;
        type: import(".prisma/client").$Enums.TransactionType;
        customerId: string | null;
        discountAmount: import("@prisma/client/runtime/library").Decimal;
        invoiceDate: Date | null;
        dueDate: Date | null;
        customerPreviousBalance: import("@prisma/client/runtime/library").Decimal | null;
        customerNewBalance: import("@prisma/client/runtime/library").Decimal | null;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        finalAmount: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.TransactionStatus;
        profit: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    findAll(req: any, field?: string, operator?: string, value?: string, endValue?: string): Promise<{
        currency: string | null;
        id: string;
        userId: string;
        vatRate: number | null;
        type: import(".prisma/client").$Enums.TransactionType;
        customerId: string | null;
        discountAmount: import("@prisma/client/runtime/library").Decimal;
        invoiceDate: Date | null;
        dueDate: Date | null;
        customerPreviousBalance: import("@prisma/client/runtime/library").Decimal | null;
        customerNewBalance: import("@prisma/client/runtime/library").Decimal | null;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        finalAmount: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.TransactionStatus;
        profit: import("@prisma/client/runtime/library").Decimal | null;
    }[]>;
    getTransactionById(req: any, id: string): Promise<{
        currency: string | null;
        id: string;
        userId: string;
        vatRate: number | null;
        type: import(".prisma/client").$Enums.TransactionType;
        customerId: string | null;
        discountAmount: import("@prisma/client/runtime/library").Decimal;
        invoiceDate: Date | null;
        dueDate: Date | null;
        customerPreviousBalance: import("@prisma/client/runtime/library").Decimal | null;
        customerNewBalance: import("@prisma/client/runtime/library").Decimal | null;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        finalAmount: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.TransactionStatus;
        profit: import("@prisma/client/runtime/library").Decimal | null;
    } | {
        message: string;
    }>;
    getProfitLast30Days(req: any): Promise<{
        profit: import("@prisma/client/runtime/library").Decimal;
    }>;
    update(req: any, id: string, dto: CreateTransactionDto): Promise<{
        currency: string | null;
        id: string;
        userId: string;
        vatRate: number | null;
        type: import(".prisma/client").$Enums.TransactionType;
        customerId: string | null;
        discountAmount: import("@prisma/client/runtime/library").Decimal;
        invoiceDate: Date | null;
        dueDate: Date | null;
        customerPreviousBalance: import("@prisma/client/runtime/library").Decimal | null;
        customerNewBalance: import("@prisma/client/runtime/library").Decimal | null;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        finalAmount: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.TransactionStatus;
        profit: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
