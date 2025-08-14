import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreatePaymentCollectionDto } from './dto/create-payment-collection.dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(req: any, createCustomerDto: CreateCustomerDto): Promise<{
        id: string;
        commercialTitle: string;
        address: string;
        taxOffice: string | null;
        taxNumber: string | null;
        email: string | null;
        phone: string | null;
        balance: import("generated/prisma/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import("generated/prisma").$Enums.CustomerType;
    }>;
    findAll(req: any, field?: string, operator?: string, value?: string): Promise<{
        id: string;
        commercialTitle: string;
        address: string;
        taxOffice: string | null;
        taxNumber: string | null;
        email: string | null;
        phone: string | null;
        balance: import("generated/prisma/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import("generated/prisma").$Enums.CustomerType;
    }[]>;
    findOne(req: any, id: string): Promise<{
        id: string;
        commercialTitle: string;
        address: string;
        taxOffice: string | null;
        taxNumber: string | null;
        email: string | null;
        phone: string | null;
        balance: import("generated/prisma/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import("generated/prisma").$Enums.CustomerType;
    }>;
    update(req: any, id: string, updateCustomerDto: CreateCustomerDto): Promise<{
        id: string;
        commercialTitle: string;
        address: string;
        taxOffice: string | null;
        taxNumber: string | null;
        email: string | null;
        phone: string | null;
        balance: import("generated/prisma/runtime/library").Decimal;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import("generated/prisma").$Enums.CustomerType;
    }>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
    createPaymentCollection(req: any, createPaymentCollectionDto: CreatePaymentCollectionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import("generated/prisma").$Enums.TransactionType;
        totalAmount: import("generated/prisma/runtime/library").Decimal;
        discountAmount: import("generated/prisma/runtime/library").Decimal;
        finalAmount: import("generated/prisma/runtime/library").Decimal;
        status: import("generated/prisma").$Enums.TransactionStatus;
        customerId: string | null;
        invoiceDate: Date | null;
        dueDate: Date | null;
        vatRate: number | null;
        currency: string | null;
    }>;
    getTransactions(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: import("generated/prisma").$Enums.TransactionType;
        totalAmount: import("generated/prisma/runtime/library").Decimal;
        discountAmount: import("generated/prisma/runtime/library").Decimal;
        finalAmount: import("generated/prisma/runtime/library").Decimal;
        status: import("generated/prisma").$Enums.TransactionStatus;
        customerId: string | null;
        invoiceDate: Date | null;
        dueDate: Date | null;
        vatRate: number | null;
        currency: string | null;
    }[]>;
}
