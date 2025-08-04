import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreatePaymentCollectionDto } from './dto/create-payment-collection.dto';
import { ICustomerRepository } from 'src/common/interfaces/customer.repository.interface';
export declare class CustomersService {
    private customerRepository;
    constructor(customerRepository: ICustomerRepository);
    createCustomer(userId: string, dto: CreateCustomerDto): Promise<{
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
    findAllByUser(userId: string): Promise<{
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
    findOne(userId: string, customerId: string): Promise<{
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
    updateCustomer(userId: string, customerId: string, dto: CreateCustomerDto): Promise<{
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
    deleteCustomer(userId: string, customerId: string): Promise<void>;
    createPaymentCollection(userId: string, dto: CreatePaymentCollectionDto): Promise<{
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
}
