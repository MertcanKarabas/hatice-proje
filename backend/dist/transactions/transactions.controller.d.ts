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
    }>;
    findAll(req: any): Promise<({
        items: ({
            product: {
                id: string;
                userId: string;
                name: string;
                price: import("generated/prisma/runtime/library").Decimal;
                description: string | null;
                sku: string;
                barcode: string | null;
            };
        } & {
            id: string;
            transactionId: string;
            productId: string;
            quantity: number;
            price: import("generated/prisma/runtime/library").Decimal;
        })[];
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("generated/prisma").$Enums.PaymentStatus;
            transactionId: string | null;
            amount: import("generated/prisma/runtime/library").Decimal;
            exchangeId: string;
            paymentMethod: import("generated/prisma").$Enums.PaymentMethod;
        }[];
        discounts: {
            id: string;
            transactionId: string | null;
            description: string | null;
            amount: import("generated/prisma/runtime/library").Decimal;
            code: string | null;
            isPercentage: boolean;
        }[];
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: import("generated/prisma/runtime/library").Decimal;
        discountAmount: import("generated/prisma/runtime/library").Decimal;
        finalAmount: import("generated/prisma/runtime/library").Decimal;
        type: import("generated/prisma").$Enums.TransactionType;
        status: import("generated/prisma").$Enums.TransactionStatus;
    })[]>;
    getTransactionById(req: any, id: string): Promise<({
        items: ({
            product: {
                id: string;
                userId: string;
                name: string;
                price: import("generated/prisma/runtime/library").Decimal;
                description: string | null;
                sku: string;
                barcode: string | null;
            };
        } & {
            id: string;
            transactionId: string;
            productId: string;
            quantity: number;
            price: import("generated/prisma/runtime/library").Decimal;
        })[];
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("generated/prisma").$Enums.PaymentStatus;
            transactionId: string | null;
            amount: import("generated/prisma/runtime/library").Decimal;
            exchangeId: string;
            paymentMethod: import("generated/prisma").$Enums.PaymentMethod;
        }[];
        discounts: {
            id: string;
            transactionId: string | null;
            description: string | null;
            amount: import("generated/prisma/runtime/library").Decimal;
            code: string | null;
            isPercentage: boolean;
        }[];
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: import("generated/prisma/runtime/library").Decimal;
        discountAmount: import("generated/prisma/runtime/library").Decimal;
        finalAmount: import("generated/prisma/runtime/library").Decimal;
        type: import("generated/prisma").$Enums.TransactionType;
        status: import("generated/prisma").$Enums.TransactionStatus;
    }) | {
        message: string;
    }>;
}
