import { CustomerType, Prisma } from '@prisma/client';
export declare class CreateCustomerDto {
    commercialTitle: string;
    address: string;
    type?: CustomerType;
    phone?: string;
    taxOffice?: string;
    taxNumber?: string;
    email?: string;
    balance?: Prisma.Decimal;
    exchangeId?: string;
}
