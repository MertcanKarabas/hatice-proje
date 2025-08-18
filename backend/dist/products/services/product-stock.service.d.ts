import { PrismaService } from 'src/prisma/prisma.service';
export declare class ProductStockService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    checkAndDecrementStockForPackageCreation(userId: string, components: {
        componentId: string;
        quantity: number;
    }[], packageQuantity: number): Promise<void>;
    createStockForNewProduct(userId: string, productId: string, quantity: number): Promise<void>;
    restoreStockForOldPackageComponents(existingProduct: any, prismaTransaction: any): Promise<void>;
    deductStockForNewPackageComponents(userId: string, components: {
        componentId: string;
        quantity: number;
    }[], packageQuantity: number, prismaTransaction: any): Promise<void>;
    revertStockForTransaction(userId: string, items: {
        productId: string;
        quantity: number;
    }[], transactionType: 'SALE' | 'PURCHASE', prismaTransaction: any): Promise<void>;
    updateStockForTransaction(userId: string, items: {
        productId: string;
        quantity: number;
    }[], transactionType: 'SALE' | 'PURCHASE', prismaTransaction: any): Promise<void>;
}
