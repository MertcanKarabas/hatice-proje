import { CreateCustomerDto } from './dto/create-customer.dto';
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
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    findAllByUser(userId: string): Promise<{
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
