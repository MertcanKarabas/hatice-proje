import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber, Min, IsNotEmpty, IsEnum } from 'class-validator';
import { ProductUnit, Currency } from 'generated/prisma';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber({}, { message: 'Miktar sayısal bir değer olmalıdır.' })
    @Min(0, { message: 'Miktar 0 veya daha büyük olmalıdır.' })
    @IsNotEmpty({ message: 'Miktar alanı boş bırakılamaz.' })
    quantity: number;

    @IsEnum(Currency, { message: 'Geçersiz para birimi seçtiniz.' })
    @IsNotEmpty()
    currency: Currency;

    @IsEnum(ProductUnit, { message: 'Geçersiz birim tipi seçtiniz.' })
    @IsNotEmpty({ message: 'Birim alanı boş bırakılamaz.' })
    unit: ProductUnit;

    @IsString()
    sku: string;

    @IsOptional()
    @IsString()
    barcode?: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price: number;
}
