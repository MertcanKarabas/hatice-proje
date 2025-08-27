import { ProductUnit, Currency } from '@prisma/client';
declare class ProductComponentDto {
    componentId: string;
    quantity: number;
}
export declare class CreateProductDto {
    name: string;
    description?: string;
    quantity: number;
    currency: Currency;
    unit: ProductUnit;
    sku: string;
    barcode?: string;
    price: number;
    isPackage?: boolean;
    components?: ProductComponentDto[];
}
export {};
