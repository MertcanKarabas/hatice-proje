import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ITransactionRepository } from 'src/common/interfaces/transaction.repository.interface';
import { ITransactionItemRepository } from 'src/common/interfaces/transaction-item.repository.interface';
import { StockService } from 'src/stock/stock.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class TransactionsService {
    constructor(
        private readonly transactionRepository: ITransactionRepository,
        private readonly transactionItemRepository: ITransactionItemRepository,
        private readonly stockService: StockService,
    ) { }

    async createTransaction(
        userId: string,
        dto: CreateTransactionDto,
    ) {
        const { type, discountAmount = 0, items } = dto;

        const totalAmount = new Prisma.Decimal(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
        const finalAmount = new Prisma.Decimal(totalAmount.minus(discountAmount));

        const transaction = await this.transactionRepository.create({
            userId,
            type,
            totalAmount,
            discountAmount: new Prisma.Decimal(discountAmount),
            finalAmount,
        });

        await this.transactionItemRepository.createMany(
            items.map((item) => ({
                transactionId: transaction.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
            })),
        );

        for (const item of items) {
            await this.stockService.updateStock(userId, item.productId, item.quantity, type);
        }

        return transaction;
    }
    async getTransactionsByUser(userId: string) {
        return this.transactionRepository.getTransactionsByUser(userId);
    }
    async getTransactionById(userId: string, transactionId: string) {
        return this.transactionRepository.getTransactionById(userId, transactionId);
    }
}
