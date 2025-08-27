import { Stock } from '@prisma/client';
import { IStockRepository } from 'src/common/interfaces/stock.repository.interface';
export declare class StockService {
    private readonly stockRepository;
    constructor(stockRepository: IStockRepository);
    updateStock(userId: string, productId: string, quantity: number, type: 'SALE' | 'PURCHASE'): Promise<Stock>;
}
