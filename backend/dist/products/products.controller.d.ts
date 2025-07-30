import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsController {
    private readonly productService;
    constructor(productService: ProductsService);
    getMyProducts(field: string, operator: string, value: string, req: any): Promise<{
        message: string;
        data: {
            name: string;
            id: string;
            userId: string;
            description: string | null;
            sku: string;
            barcode: string | null;
            price: import("generated/prisma/runtime/library").Decimal;
            quantity: number;
            unit: import("generated/prisma").$Enums.ProductUnit;
            currency: import("generated/prisma").$Enums.Currency;
        }[];
    }>;
    create(req: any, createProductDto: CreateProductDto): Promise<{
        message: string;
        data: {
            name: string;
            id: string;
            userId: string;
            description: string | null;
            sku: string;
            barcode: string | null;
            price: import("generated/prisma/runtime/library").Decimal;
            quantity: number;
            unit: import("generated/prisma").$Enums.ProductUnit;
            currency: import("generated/prisma").$Enums.Currency;
        };
    }>;
    update(req: any, id: string, updateProductDto: CreateProductDto): Promise<{
        message: string;
        data: {
            name: string;
            id: string;
            userId: string;
            description: string | null;
            sku: string;
            barcode: string | null;
            price: import("generated/prisma/runtime/library").Decimal;
            quantity: number;
            unit: import("generated/prisma").$Enums.ProductUnit;
            currency: import("generated/prisma").$Enums.Currency;
        };
    }>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
