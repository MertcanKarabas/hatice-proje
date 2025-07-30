import { Stock } from 'generated/prisma';
import { IBaseRepository } from './base.repository.interface';
export declare abstract class IStockRepository implements IBaseRepository<Stock> {
    abstract findStockByProductAndUser(userId: string, productId: string): Promise<Stock | null>;
    abstract updateStockQuantity(stockId: string, newQuantity: number): Promise<Stock>;
    abstract createStock(userId: string, productId: string, quantity: number): Promise<Stock>;
    abstract findById(id: string): Promise<Stock | null>;
    abstract findAll(): Promise<Stock[]>;
    abstract create(data: Partial<Stock>): Promise<Stock>;
    abstract update(id: string, data: Partial<Stock>): Promise<Stock>;
    abstract delete(id: string): Promise<void>;
}
