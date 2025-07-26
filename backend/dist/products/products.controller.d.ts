import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductsController {
    private readonly productService;
    constructor(productService: ProductsService);
    getMyProducts(req: any): Promise<{
        message: string;
        data: {
            id: string;
            userId: string;
            name: string;
            description: string | null;
            sku: string;
            barcode: string | null;
            price: import("generated/prisma/runtime/library").Decimal;
        }[];
    }>;
    create(req: any, createProductDto: CreateProductDto): Promise<{
        message: string;
        data: {
            id: string;
            userId: string;
            name: string;
            description: string | null;
            sku: string;
            barcode: string | null;
            price: import("generated/prisma/runtime/library").Decimal;
        };
    }>;
    update(req: any, id: string, updateProductDto: CreateProductDto): Promise<{
        message: string;
        data: import("generated/prisma").Prisma.BatchPayload;
    }>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
