import { IsString, IsOptional, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateCustomerDto {
    @IsString()
    commercialTitle: string;

    @IsString()
    address?: string

    @IsPhoneNumber('TR', { message: 'Lütfen geçerli bir telefon numarası giriniz.' })
    phone?: string;

    @IsOptional()
    @IsString()
    taxOffice?: string;

    @IsOptional()
    @IsString()
    taxNumber?: string;

    @IsOptional()
    @IsEmail()
    email?: string;
}