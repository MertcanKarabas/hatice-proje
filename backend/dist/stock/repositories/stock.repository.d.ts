import { Stock } from '@prisma/client';
import { BaseRepository } from '../../common/database/repositories/base.repository';
import { IStockRepository } from '../../common/interfaces/stock.repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class StockRepository extends BaseRepository<Stock> implements IStockRepository {
    constructor(prisma: PrismaService);
    findStockByProductAndUser(userId: string, productId: string): Promise<Stock | null>;
    updateStockQuantity(stockId: string, newQuantity: number): Promise<Stock>;
    createStock(userId: string, productId: string, quantity: number): Promise<Stock>;
}
