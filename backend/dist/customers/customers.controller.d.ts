import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(req: any, createCustomerDto: CreateCustomerDto): Promise<{
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
    findAll(req: any): Promise<{
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
    findOne(req: any, id: string): Promise<{
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
    update(req: any, id: string, updateCustomerDto: CreateCustomerDto): Promise<{
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
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
