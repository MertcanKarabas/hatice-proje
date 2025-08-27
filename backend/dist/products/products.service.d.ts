import { CreateProductDto } from './dto/create-product.dto';
import { Prisma } from '@prisma/client';
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
        name: string;
        id: string;
        userId: string;
        description: string | null;
        sku: string;
        barcode: string | null;
        price: Prisma.Decimal;
        quantity: number;
        unit: import(".prisma/client").$Enums.ProductUnit;
        currency: import(".prisma/client").$Enums.Currency;
        isPackage: boolean;
    }[]>;
    findOne(userId: string, productId: string): Promise<{
        name: string;
        id: string;
        userId: string;
        description: string | null;
        sku: string;
        barcode: string | null;
        price: Prisma.Decimal;
        quantity: number;
        unit: import(".prisma/client").$Enums.ProductUnit;
        currency: import(".prisma/client").$Enums.Currency;
        isPackage: boolean;
    }>;
    createProduct(userId: string, dto: CreateProductDto): Promise<{
        name: string;
        id: string;
        userId: string;
        description: string | null;
        sku: string;
        barcode: string | null;
        price: Prisma.Decimal;
        quantity: number;
        unit: import(".prisma/client").$Enums.ProductUnit;
        currency: import(".prisma/client").$Enums.Currency;
        isPackage: boolean;
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
        unit: import(".prisma/client").$Enums.ProductUnit;
        currency: import(".prisma/client").$Enums.Currency;
        isPackage: boolean;
    }>;
    deleteProduct(userId: string, productId: string): Promise<void>;
}
