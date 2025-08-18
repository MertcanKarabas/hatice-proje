import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsController {
    private readonly productService;
    constructor(productService: ProductsService);
    getMyProducts(field: string, operator: string, value: string, req: any): Promise<{
        message: string;
        data: {
            quantity: number;
            name: string;
            description: string | null;
            currency: import("generated/prisma").$Enums.Currency;
            unit: import("generated/prisma").$Enums.ProductUnit;
            sku: string;
            barcode: string | null;
            price: import("generated/prisma/runtime/library").Decimal;
            isPackage: boolean;
            id: string;
            userId: string;
        }[];
    }>;
    findOne(req: any, id: string): Promise<{
        message: string;
        data: {
            quantity: number;
            name: string;
            description: string | null;
            currency: import("generated/prisma").$Enums.Currency;
            unit: import("generated/prisma").$Enums.ProductUnit;
            sku: string;
            barcode: string | null;
            price: import("generated/prisma/runtime/library").Decimal;
            isPackage: boolean;
            id: string;
            userId: string;
        };
    }>;
    create(req: any, createProductDto: CreateProductDto): Promise<{
        message: string;
        data: {
            quantity: number;
            name: string;
            description: string | null;
            currency: import("generated/prisma").$Enums.Currency;
            unit: import("generated/prisma").$Enums.ProductUnit;
            sku: string;
            barcode: string | null;
            price: import("generated/prisma/runtime/library").Decimal;
            isPackage: boolean;
            id: string;
            userId: string;
        };
    }>;
    update(req: any, id: string, updateProductDto: CreateProductDto): Promise<{
        message: string;
        data: {
            quantity: number;
            name: string;
            description: string | null;
            currency: import("generated/prisma").$Enums.Currency;
            unit: import("generated/prisma").$Enums.ProductUnit;
            sku: string;
            barcode: string | null;
            price: import("generated/prisma/runtime/library").Decimal;
            isPackage: boolean;
            id: string;
            userId: string;
        };
    }>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
