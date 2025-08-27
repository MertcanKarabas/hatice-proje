import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class ProfitCalculationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    calculateProfit(items: {
        productId: string;
        quantity: number;
        price: number;
    }[], prismaTransaction: any): Promise<Prisma.Decimal>;
}
