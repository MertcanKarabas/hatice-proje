import { CreateProductDto } from './dto/create-product.dto';
import { Prisma } from 'generated/prisma';
import { IProductRepository } from 'src/common/interfaces/product.repository.interface';
import { IProductFilterService } from './interfaces/product-filter.service.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductStockService } from './services/product-stock.service';
export declare class ProductsService {
    private productRepository;
    private productFilterService;
    private prisma;
    private productStockService;
    constructor(productRepository: IProductRepository, productFilterService: IProductFilterService, prisma: PrismaService, productStockService: ProductStockService);
    findAllByUser(userId: string, field: string, operator: string, value: string): Promise<{
        quantity: number;
        name: string;
        description: string | null;
        currency: import("generated/prisma").$Enums.Currency;
        unit: import("generated/prisma").$Enums.ProductUnit;
        sku: string;
        barcode: string | null;
        price: Prisma.Decimal;
        isPackage: boolean;
        id: string;
        userId: string;
    }[]>;
    findOne(userId: string, productId: string): Promise<{
        quantity: number;
        name: string;
        description: string | null;
        currency: import("generated/prisma").$Enums.Currency;
        unit: import("generated/prisma").$Enums.ProductUnit;
        sku: string;
        barcode: string | null;
        price: Prisma.Decimal;
        isPackage: boolean;
        id: string;
        userId: string;
    }>;
    createProduct(userId: string, dto: CreateProductDto): Promise<{
        quantity: number;
        name: string;
        description: string | null;
        currency: import("generated/prisma").$Enums.Currency;
        unit: import("generated/prisma").$Enums.ProductUnit;
        sku: string;
        barcode: string | null;
        price: Prisma.Decimal;
        isPackage: boolean;
        id: string;
        userId: string;
    }>;
    updateProduct(userId: string, productId: string, dto: CreateProductDto): Promise<{
        quantity: number;
        name: string;
        description: string | null;
        currency: import("generated/prisma").$Enums.Currency;
        unit: import("generated/prisma").$Enums.ProductUnit;
        sku: string;
        barcode: string | null;
        price: Prisma.Decimal;
        isPackage: boolean;
        id: string;
        userId: string;
    }>;
    deleteProduct(userId: string, productId: string): Promise<void>;
}
