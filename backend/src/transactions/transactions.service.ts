import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
        const { type, discountAmount = 0, items, customerId } = dto;

        for (const item of items) {
            const stock = await this.prisma.stock.findFirst({ where: { productId: item.productId, userId } });
            if (!stock || stock.quantity < item.quantity) {
                const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
                throw new BadRequestException(`Yetersiz stok: ${product?.name ?? item.productId}`);
            }
        }

        const totalAmount = new Prisma.Decimal(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
        const finalAmount = new Prisma.Decimal(totalAmount.minus(discountAmount));

        const transaction = await this.transactionRepository.create({
            userId,
            type,
            customerId,
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
        return this.prisma.$transaction(async (prisma) => {
            const existingTransaction = await prisma.transaction.findUnique({
                where: { id: transactionId, userId },
                include: { items: true },
            });

            if (!existingTransaction) {
                throw new NotFoundException(`Transaction with ID ${transactionId} not found or access denied.`);
            }

            // Revert old stock quantities
            for (const item of existingTransaction.items) {
                await this.stockService.updateStock(userId, item.productId, -item.quantity, existingTransaction.type);
            }

            const { type, discountAmount = 0, items } = dto;

            // Check new stock quantities
            for (const item of items) {
                const stock = await prisma.stock.findFirst({ where: { productId: item.productId, userId } });
                if (!stock || stock.quantity < item.quantity) {
                    const product = await prisma.product.findUnique({ where: { id: item.productId } });
                    throw new BadRequestException(`Yetersiz stok: ${product?.name ?? item.productId}`);
                }
            }

            const totalAmount = new Prisma.Decimal(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
            const finalAmount = new Prisma.Decimal(totalAmount.minus(discountAmount));

            await prisma.transactionItem.deleteMany({ where: { transactionId } });

            await prisma.transactionItem.createMany({
                data: items.map((item) => ({
                    transactionId: transactionId,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    unit: item.unit,
                    vatRate: item.vatRate,
                })),
            });

            // Update stock with new quantities
            for (const item of items) {
                await this.stockService.updateStock(userId, item.productId, item.quantity, type);
            }

            return prisma.transaction.update({
                where: { id: transactionId },
                data: {
                    type,
                    totalAmount,
                    discountAmount: new Prisma.Decimal(discountAmount),
                    finalAmount,
                },
            });
        });
    }

    async deleteTransaction(userId: string, transactionId: string) {
        await this.prisma.$transaction(async (prisma) => {
            const transaction = await prisma.transaction.findUnique({
                where: { id: transactionId, userId },
                include: { items: true },
            });

            if (!transaction) {
                throw new NotFoundException(`Transaction with ID ${transactionId} not found or access denied.`);
            }

            // Revert stock quantities before deleting the transaction
            for (const item of transaction.items) {
                await this.stockService.updateStock(userId, item.productId, -item.quantity, transaction.type);
            }

            await prisma.transactionItem.deleteMany({ where: { transactionId } });
            await prisma.transaction.delete({ where: { id: transactionId } });
        });
    }
}



