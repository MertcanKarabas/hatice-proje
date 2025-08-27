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
            price: import("@prisma/client/runtime/library").Decimal;
            quantity: number;
            unit: import(".prisma/client").$Enums.ProductUnit;
            currency: import(".prisma/client").$Enums.Currency;
            isPackage: boolean;
        }[];
    }>;
    findOne(req: any, id: string): Promise<{
        message: string;
        data: {
            name: string;
            id: string;
            userId: string;
            description: string | null;
            sku: string;
            barcode: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            quantity: number;
            unit: import(".prisma/client").$Enums.ProductUnit;
            currency: import(".prisma/client").$Enums.Currency;
            isPackage: boolean;
        };
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
            price: import("@prisma/client/runtime/library").Decimal;
            quantity: number;
            unit: import(".prisma/client").$Enums.ProductUnit;
            currency: import(".prisma/client").$Enums.Currency;
            isPackage: boolean;
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
            price: import("@prisma/client/runtime/library").Decimal;
            quantity: number;
            unit: import(".prisma/client").$Enums.ProductUnit;
            currency: import(".prisma/client").$Enums.Currency;
            isPackage: boolean;
        };
    }>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
