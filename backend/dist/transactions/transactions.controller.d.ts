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
        type: import("generated/prisma").$Enums.TransactionType;
        customerId: string | null;
        discountAmount: import("generated/prisma/runtime/library").Decimal;
        invoiceDate: Date | null;
        dueDate: Date | null;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: import("generated/prisma/runtime/library").Decimal;
        finalAmount: import("generated/prisma/runtime/library").Decimal;
        status: import("generated/prisma").$Enums.TransactionStatus;
        profit: import("generated/prisma/runtime/library").Decimal | null;
    }>;
    findAll(req: any, field?: string, operator?: string, value?: string, endValue?: string): Promise<{
        currency: string | null;
        id: string;
        userId: string;
        vatRate: number | null;
        type: import("generated/prisma").$Enums.TransactionType;
        customerId: string | null;
        discountAmount: import("generated/prisma/runtime/library").Decimal;
        invoiceDate: Date | null;
        dueDate: Date | null;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: import("generated/prisma/runtime/library").Decimal;
        finalAmount: import("generated/prisma/runtime/library").Decimal;
        status: import("generated/prisma").$Enums.TransactionStatus;
        profit: import("generated/prisma/runtime/library").Decimal | null;
    }[]>;
    getTransactionById(req: any, id: string): Promise<{
        currency: string | null;
        id: string;
        userId: string;
        vatRate: number | null;
        type: import("generated/prisma").$Enums.TransactionType;
        customerId: string | null;
        discountAmount: import("generated/prisma/runtime/library").Decimal;
        invoiceDate: Date | null;
        dueDate: Date | null;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: import("generated/prisma/runtime/library").Decimal;
        finalAmount: import("generated/prisma/runtime/library").Decimal;
        status: import("generated/prisma").$Enums.TransactionStatus;
        profit: import("generated/prisma/runtime/library").Decimal | null;
    } | {
        message: string;
    }>;
    getProfitLast30Days(req: any): Promise<{
        profit: import("generated/prisma/runtime/library").Decimal;
    }>;
    update(req: any, id: string, dto: CreateTransactionDto): Promise<{
        currency: string | null;
        id: string;
        userId: string;
        vatRate: number | null;
        type: import("generated/prisma").$Enums.TransactionType;
        customerId: string | null;
        discountAmount: import("generated/prisma/runtime/library").Decimal;
        invoiceDate: Date | null;
        dueDate: Date | null;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: import("generated/prisma/runtime/library").Decimal;
        finalAmount: import("generated/prisma/runtime/library").Decimal;
        status: import("generated/prisma").$Enums.TransactionStatus;
        profit: import("generated/prisma/runtime/library").Decimal | null;
    }>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
