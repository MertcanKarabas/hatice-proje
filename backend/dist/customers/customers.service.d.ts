import { CreateCustomerDto } from './dto/create-customer.dto';
import { ICustomerRepository } from 'src/common/interfaces/customer.repository.interface';
export declare class CustomersService {
    private customerRepository;
    constructor(customerRepository: ICustomerRepository);
    createCustomer(userId: string, dto: CreateCustomerDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("generated/prisma").$Enums.CustomerType;
        email: string | null;
        commercialTitle: string;
        address: string;
        taxOffice: string | null;
        taxNumber: string | null;
        phone: string | null;
        balance: import("generated/prisma/runtime/library").Decimal;
    }>;
    findAllByUser(userId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("generated/prisma").$Enums.CustomerType;
        email: string | null;
        commercialTitle: string;
        address: string;
        taxOffice: string | null;
        taxNumber: string | null;
        phone: string | null;
        balance: import("generated/prisma/runtime/library").Decimal;
    }[]>;
    findOne(userId: string, customerId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("generated/prisma").$Enums.CustomerType;
        email: string | null;
        commercialTitle: string;
        address: string;
        taxOffice: string | null;
        taxNumber: string | null;
        phone: string | null;
        balance: import("generated/prisma/runtime/library").Decimal;
    }>;
    updateCustomer(userId: string, customerId: string, dto: CreateCustomerDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        type: import("generated/prisma").$Enums.CustomerType;
        email: string | null;
        commercialTitle: string;
        address: string;
        taxOffice: string | null;
        taxNumber: string | null;
        phone: string | null;
        balance: import("generated/prisma/runtime/library").Decimal;
    }>;
    deleteCustomer(userId: string, customerId: string): Promise<void>;
}
