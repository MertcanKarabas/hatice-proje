import { CustomerType } from 'generated/prisma';
export declare class CreateCustomerDto {
    commercialTitle: string;
    address: string;
    type?: CustomerType;
    phone?: string;
    taxOffice?: string;
    taxNumber?: string;
    email?: string;
}
