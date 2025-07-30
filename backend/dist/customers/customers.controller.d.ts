import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(req: any, createCustomerDto: CreateCustomerDto): Promise<{
        id: string;
        userId: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        commercialTitle: string;
        contactPerson: string;
        taxOffice: string | null;
        taxNumber: string | null;
        phone: string | null;
    }>;
    findAll(req: any): Promise<{
        id: string;
        userId: string;
        email: string | null;
        createdAt: Date;
        updatedAt: Date;
        commercialTitle: string;
        contactPerson: string;
        taxOffice: string | null;
        taxNumber: string | null;
        phone: string | null;
    }[]>;
}
