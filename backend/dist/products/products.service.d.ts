import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Prisma } from 'generated/prisma';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllByUser(userId: string, field: string, operator: string, value: string): Promise<{
        id: string;
        userId: string;
        name: string;
        description: string | null;
        sku: string;
        barcode: string | null;
        price: Prisma.Decimal;
        quantity: number;
        unit: import("generated/prisma").$Enums.ProductUnit;
        currency: import("generated/prisma").$Enums.Currency;
    }[]>;
    createProduct(userId: string, dto: CreateProductDto): Promise<{
        id: string;
        userId: string;
        name: string;
        description: string | null;
        sku: string;
        barcode: string | null;
        price: Prisma.Decimal;
        quantity: number;
        unit: import("generated/prisma").$Enums.ProductUnit;
        currency: import("generated/prisma").$Enums.Currency;
    }>;
    updateProduct(userId: string, productId: string, dto: CreateProductDto): Promise<Prisma.BatchPayload>;
    deleteProduct(userId: string, productId: string): Promise<Prisma.BatchPayload>;
}
