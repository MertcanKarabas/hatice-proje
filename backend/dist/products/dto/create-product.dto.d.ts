import { ProductUnit, Currency } from 'generated/prisma';
export declare class CreateProductDto {
    name: string;
    description?: string;
    quantity: number;
    currency: Currency;
    unit: ProductUnit;
    sku: string;
    barcode?: string;
    price: number;
}
