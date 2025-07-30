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
        totalAmount: import("generated/prisma/runtime/library").Decimal;
        discountAmount: import("generated/prisma/runtime/library").Decimal;
        finalAmount: import("generated/prisma/runtime/library").Decimal;
        type: import("generated/prisma").$Enums.TransactionType;
        status: import("generated/prisma").$Enums.TransactionStatus;
        customerId: string | null;
    }>;
    findAll(req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: import("generated/prisma/runtime/library").Decimal;
        discountAmount: import("generated/prisma/runtime/library").Decimal;
        finalAmount: import("generated/prisma/runtime/library").Decimal;
        type: import("generated/prisma").$Enums.TransactionType;
        status: import("generated/prisma").$Enums.TransactionStatus;
        customerId: string | null;
    }[]>;
    getTransactionById(req: any, id: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: import("generated/prisma/runtime/library").Decimal;
        discountAmount: import("generated/prisma/runtime/library").Decimal;
        finalAmount: import("generated/prisma/runtime/library").Decimal;
        type: import("generated/prisma").$Enums.TransactionType;
        status: import("generated/prisma").$Enums.TransactionStatus;
        customerId: string | null;
    } | {
        message: string;
    }>;
}
