import { IsString, IsOptional, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateCustomerDto {
    @IsString()
    commercialTitle: string;

    @IsString()
    @IsOptional()
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
    @IsPhoneNumber('TR', { message: 'Lütfen geçerli bir telefon numarası giriniz.' })
    phone?: string;
}