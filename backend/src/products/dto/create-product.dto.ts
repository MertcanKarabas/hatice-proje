import { Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

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
