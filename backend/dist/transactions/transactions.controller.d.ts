import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    create(req: any, dto: CreateTransactionDto): Promise<{
        id: string;
        userId: string;
        type: import("generated/prisma").$Enums.TransactionType;
        discountAmount: import("generated/prisma/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: import("generated/prisma/runtime/library").Decimal;
        finalAmount: import("generated/prisma/runtime/library").Decimal;
        status: import("generated/prisma").$Enums.TransactionStatus;
        customerId: string | null;
    }>;
    findAll(req: any): Promise<({
        items: ({
            product: {
                id: string;
                userId: string;
                name: string;
                description: string | null;
                sku: string;
                barcode: string | null;
                price: import("generated/prisma/runtime/library").Decimal;
            };
        } & {
            id: string;
            price: import("generated/prisma/runtime/library").Decimal;
            productId: string;
            quantity: number;
            transactionId: string;
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
            description: string | null;
            transactionId: string | null;
            amount: import("generated/prisma/runtime/library").Decimal;
            code: string | null;
            isPercentage: boolean;
        }[];
    } & {
        id: string;
        userId: string;
        type: import("generated/prisma").$Enums.TransactionType;
        discountAmount: import("generated/prisma/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: import("generated/prisma/runtime/library").Decimal;
        finalAmount: import("generated/prisma/runtime/library").Decimal;
        status: import("generated/prisma").$Enums.TransactionStatus;
        customerId: string | null;
    })[]>;
    getTransactionById(req: any, id: string): Promise<({
        items: ({
            product: {
                id: string;
                userId: string;
                name: string;
                description: string | null;
                sku: string;
                barcode: string | null;
                price: import("generated/prisma/runtime/library").Decimal;
            };
        } & {
            id: string;
            price: import("generated/prisma/runtime/library").Decimal;
            productId: string;
            quantity: number;
            transactionId: string;
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
            description: string | null;
            transactionId: string | null;
            amount: import("generated/prisma/runtime/library").Decimal;
            code: string | null;
            isPercentage: boolean;
        }[];
    } & {
        id: string;
        userId: string;
        type: import("generated/prisma").$Enums.TransactionType;
        discountAmount: import("generated/prisma/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
        totalAmount: import("generated/prisma/runtime/library").Decimal;
        finalAmount: import("generated/prisma/runtime/library").Decimal;
        status: import("generated/prisma").$Enums.TransactionStatus;
        customerId: string | null;
    }) | {
        message: string;
    }>;
}
