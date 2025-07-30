import { CreateProductDto } from './dto/create-product.dto';
import { Prisma } from 'generated/prisma';
import { IProductRepository } from 'src/common/interfaces/product.repository.interface';
import { IProductFilterService } from './interfaces/product-filter.service.interface';
export declare class ProductsService {
    private productRepository;
    private productFilterService;
    constructor(productRepository: IProductRepository, productFilterService: IProductFilterService);
    findAllByUser(userId: string, field: string, operator: string, value: string): Promise<{
        name: string;
        id: string;
        userId: string;
        description: string | null;
        sku: string;
        barcode: string | null;
        price: Prisma.Decimal;
        quantity: number;
        unit: import("generated/prisma").$Enums.ProductUnit;
        currency: import("generated/prisma").$Enums.Currency;
    }[]>;
    createProduct(userId: string, dto: CreateProductDto): Promise<{
        name: string;
        id: string;
        userId: string;
        description: string | null;
        sku: string;
        barcode: string | null;
        price: Prisma.Decimal;
        quantity: number;
        unit: import("generated/prisma").$Enums.ProductUnit;
        currency: import("generated/prisma").$Enums.Currency;
    }>;
    updateProduct(userId: string, productId: string, dto: CreateProductDto): Promise<{
        name: string;
        id: string;
        userId: string;
        description: string | null;
        sku: string;
        barcode: string | null;
        price: Prisma.Decimal;
        quantity: number;
        unit: import("generated/prisma").$Enums.ProductUnit;
        currency: import("generated/prisma").$Enums.Currency;
    }>;
    deleteProduct(userId: string, productId: string): Promise<void>;
}
