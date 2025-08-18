import { PrismaService } from 'src/prisma/prisma.service';
export declare class TransactionStockService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    checkStockAvailability(userId: string, items: {
        productId: string;
        quantity: number;
    }[], prismaTransaction: any): Promise<void>;
    updateStockForTransaction(userId: string, items: {
        productId: string;
        quantity: number;
    }[], type: 'SALE' | 'PURCHASE', prismaTransaction: any): Promise<void>;
    revertStockForTransaction(userId: string, items: {
        productId: string;
        quantity: number;
    }[], type: 'SALE' | 'PURCHASE', prismaTransaction: any): Promise<void>;
}
