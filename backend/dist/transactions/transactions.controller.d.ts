import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    create(req: any, dto: CreateTransactionDto): Promise<{
        id: string;
        userId: string;
        type: import("generated/prisma").$Enums.TransactionType;
        customerId: string | null;
        discountAmount: import("generated/prisma/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: import("generated/prisma/runtime/library").Decimal;
        finalAmount: import("generated/prisma/runtime/library").Decimal;
        status: import("generated/prisma").$Enums.TransactionStatus;
    }>;
    findAll(req: any): Promise<{
        id: string;
        userId: string;
        type: import("generated/prisma").$Enums.TransactionType;
        customerId: string | null;
        discountAmount: import("generated/prisma/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: import("generated/prisma/runtime/library").Decimal;
        finalAmount: import("generated/prisma/runtime/library").Decimal;
        status: import("generated/prisma").$Enums.TransactionStatus;
    }[]>;
    getTransactionById(req: any, id: string): Promise<{
        id: string;
        userId: string;
        type: import("generated/prisma").$Enums.TransactionType;
        customerId: string | null;
        discountAmount: import("generated/prisma/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: import("generated/prisma/runtime/library").Decimal;
        finalAmount: import("generated/prisma/runtime/library").Decimal;
        status: import("generated/prisma").$Enums.TransactionStatus;
    } | {
        message: string;
    }>;
    update(req: any, id: string, dto: CreateTransactionDto): Promise<{
        id: string;
        userId: string;
        type: import("generated/prisma").$Enums.TransactionType;
        customerId: string | null;
        discountAmount: import("generated/prisma/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: import("generated/prisma/runtime/library").Decimal;
        finalAmount: import("generated/prisma/runtime/library").Decimal;
        status: import("generated/prisma").$Enums.TransactionStatus;
    }>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
