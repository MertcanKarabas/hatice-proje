import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Prisma } from 'generated/prisma';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllByUser(userId: string): Promise<{
        id: string;
        userId: string;
        name: string;
        description: string | null;
        sku: string;
        barcode: string | null;
        price: Prisma.Decimal;
    }[]>;
    createProduct(userId: string, dto: CreateProductDto): Promise<{
        id: string;
        userId: string;
        name: string;
        description: string | null;
        sku: string;
        barcode: string | null;
        price: Prisma.Decimal;
    }>;
    updateProduct(userId: string, productId: string, dto: CreateProductDto): Promise<Prisma.BatchPayload>;
    deleteProduct(userId: string, productId: string): Promise<Prisma.BatchPayload>;
}
