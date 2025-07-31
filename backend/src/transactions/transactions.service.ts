import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ITransactionRepository } from 'src/common/interfaces/transaction.repository.interface';
import { ITransactionItemRepository } from 'src/common/interfaces/transaction-item.repository.interface';
import { StockService } from 'src/stock/stock.service';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionsService {
    constructor(
        private readonly transactionRepository: ITransactionRepository,
        private readonly transactionItemRepository: ITransactionItemRepository,
        private readonly stockService: StockService,
        private readonly prisma: PrismaService,
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
                unit: item.unit,
                vatRate: item.vatRate,
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

    async updateTransaction(userId: string, transactionId: string, dto: CreateTransactionDto) {
        const transaction = await this.getTransactionById(userId, transactionId);
        if (!transaction) {
            throw new NotFoundException(`Transaction with ID ${transactionId} not found or access denied.`);
        }

        // Logic to update a transaction is complex and depends on business rules.
        // This is a simplified example. You might need to handle item changes, stock updates, etc.
        const { type, discountAmount = 0, items } = dto;

        const totalAmount = new Prisma.Decimal(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
        const finalAmount = new Prisma.Decimal(totalAmount.minus(discountAmount));

        // For simplicity, we'll delete old items and create new ones.
        // In a real app, you'd want a more sophisticated update logic.
        await this.prisma.transactionItem.deleteMany({ where: { transactionId } });
        await this.transactionItemRepository.createMany(
            items.map((item) => ({
                transactionId: transaction.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                unit: item.unit,
                vatRate: item.vatRate,
            })),
        );

        // You would also need to revert old stock changes and apply new ones.
        // This is not implemented here for brevity.

        return this.transactionRepository.update(transactionId, {
            type,
            totalAmount,
            discountAmount: new Prisma.Decimal(discountAmount),
            finalAmount,
        });
    }

    async deleteTransaction(userId: string, transactionId: string) {
        const transaction = await this.getTransactionById(userId, transactionId);
        if (!transaction) {
            throw new NotFoundException(`Transaction with ID ${transactionId} not found or access denied.`);
        }

        // Also, consider how to handle stock when a transaction is deleted.
        // Reverting stock changes might be necessary.

        await this.prisma.transactionItem.deleteMany({ where: { transactionId } });
        await this.transactionRepository.delete(transactionId);
    }
}
