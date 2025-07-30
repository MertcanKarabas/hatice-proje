import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
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
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    findAll(req: any): Promise<{
        id: string;
        commercialTitle: string;
        address: string;
        taxOffice: string | null;
        taxNumber: string | null;
        email: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }[]>;
}
