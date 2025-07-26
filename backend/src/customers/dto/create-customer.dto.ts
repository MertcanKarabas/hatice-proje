import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateCustomerDto {
    @IsString()
    commercialTitle: string;

    @IsString()
    contactPerson: string;

    @IsOptional()
    @IsString()
    taxOffice?: string;

    @IsOptional()
    @IsString()
    taxNumber?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;
}