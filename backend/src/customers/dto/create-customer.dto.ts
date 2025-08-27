import { IsString, IsOptional, IsEmail, IsPhoneNumber, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { CustomerType, Prisma } from '@prisma/client';

export class CreateCustomerDto {
    @IsString()
    commercialTitle: string;

    @IsString()
    address: string;

    @IsOptional()
    @IsEnum(CustomerType)
    type?: CustomerType;

    @Transform(({ value }) => (value === '' ? null : value))
    @IsOptional()
    @IsPhoneNumber('TR', { message: 'Lütfen geçerli bir telefon numarası giriniz.' })
    phone?: string;

    @IsOptional()
    @IsString()
    taxOffice?: string;

    @IsOptional()
    @IsString()
    taxNumber?: string;

    @Transform(({ value }) => (value === '' ? null : value))
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @Transform(({ value }) => value ? new Prisma.Decimal(value) : undefined)
    balance?: Prisma.Decimal;
}