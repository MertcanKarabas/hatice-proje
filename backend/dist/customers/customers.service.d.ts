import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
export declare class CustomersService {
    private prisma;
    constructor(prisma: PrismaService);
    createCustomer(userId: string, dto: CreateCustomerDto): Promise<{
        id: string;
        commercialTitle: string;
        contactPerson: string;
        taxOffice: string | null;
        taxNumber: string | null;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    findAllByUser(userId: string): Promise<{
        id: string;
        commercialTitle: string;
        contactPerson: string;
        taxOffice: string | null;
        taxNumber: string | null;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }[]>;
}
