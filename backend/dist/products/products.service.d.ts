import { CreateProductDto } from './dto/create-product.dto';
import { Prisma } from 'generated/prisma';
import { IProductRepository } from 'src/common/interfaces/product.repository.interface';
import { IProductFilterService } from './interfaces/product-filter.service.interface';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class ProductsService {
    private productRepository;
    private productFilterService;
    private prisma;
    constructor(productRepository: IProductRepository, productFilterService: IProductFilterService, prisma: PrismaService);
    findAllByUser(userId: string, field: string, operator: string, value: string): Promise<{
        name: string;
        id: string;
        userId: string;
        currency: import("generated/prisma").$Enums.Currency;
        description: string | null;
        sku: string;
        barcode: string | null;
        price: Prisma.Decimal;
        quantity: number;
        unit: import("generated/prisma").$Enums.ProductUnit;
        isPackage: boolean;
    }[]>;
    findOne(userId: string, productId: string): Promise<{
        name: string;
        id: string;
        userId: string;
        currency: import("generated/prisma").$Enums.Currency;
        description: string | null;
        sku: string;
        barcode: string | null;
        price: Prisma.Decimal;
        quantity: number;
        unit: import("generated/prisma").$Enums.ProductUnit;
        isPackage: boolean;
    }>;
    createProduct(userId: string, dto: CreateProductDto): Promise<{
        name: string;
        id: string;
        userId: string;
        currency: import("generated/prisma").$Enums.Currency;
        description: string | null;
        sku: string;
        barcode: string | null;
        price: Prisma.Decimal;
        quantity: number;
        unit: import("generated/prisma").$Enums.ProductUnit;
        isPackage: boolean;
    }>;
    updateProduct(userId: string, productId: string, dto: CreateProductDto): Promise<{
        name: string;
        id: string;
        userId: string;
        currency: import("generated/prisma").$Enums.Currency;
        description: string | null;
        sku: string;
        barcode: string | null;
        price: Prisma.Decimal;
        quantity: number;
        unit: import("generated/prisma").$Enums.ProductUnit;
        isPackage: boolean;
    }>;
    deleteProduct(userId: string, productId: string): Promise<void>;
}
