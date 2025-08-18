import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ITransactionRepository } from 'src/common/interfaces/transaction.repository.interface';
import { ITransactionItemRepository } from 'src/common/interfaces/transaction-item.repository.interface';
import { Prisma, TransactionType } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { ITransactionFilterService } from './interfaces/transaction-filter.service.interface';
import { TransactionStockService } from './services/transaction-stock.service';
import { CustomerBalanceService } from './services/customer-balance.service';
import { ProfitCalculationService } from './services/profit-calculation.service';

@Injectable()
export class TransactionsService {
    constructor(
        private readonly transactionRepository: ITransactionRepository,
        private readonly transactionItemRepository: ITransactionItemRepository,
        private readonly prisma: PrismaService,
        private readonly transactionFilterService: ITransactionFilterService,
        private readonly transactionStockService: TransactionStockService,
        private readonly customerBalanceService: CustomerBalanceService,
        private readonly profitCalculationService: ProfitCalculationService,
    ) { }

    async createTransaction(
        userId: string,
        dto: CreateTransactionDto,
    ) {
        return this.prisma.$transaction(async (prisma) => {
            const { type, discountAmount = 0, items, customerId, invoiceDate, dueDate, vatRate, currency } = dto;

            if (type === 'SALE') {
                await this.transactionStockService.checkStockAvailability(userId, items, prisma);
            }

            const totalAmount = new Prisma.Decimal(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
            const finalAmount = new Prisma.Decimal(totalAmount.minus(discountAmount));

            let profit: Prisma.Decimal | null = null;
            if (type === 'SALE') {
                profit = await this.profitCalculationService.calculateProfit(items, prisma);
            }

            const transaction = await prisma.transaction.create({
                data: {
                    userId,
                    type,
                    customerId,
                    totalAmount,
                    discountAmount: new Prisma.Decimal(discountAmount),
                    finalAmount,
                    profit,
                    invoiceDate: invoiceDate ? new Date(invoiceDate) : null,
                    dueDate: dueDate ? new Date(dueDate) : null,
                    vatRate,
                    currency,
                },
            });

            if (items && items.length > 0) {
                await prisma.transactionItem.createMany({
                    data: items.map((item) => ({
                        transactionId: transaction.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                        unit: item.unit,
                        vatRate: item.vatRate,
                    })),
                });

                if (type === 'SALE' || type === 'PURCHASE') {
                    await this.transactionStockService.updateStockForTransaction(userId, items, type, prisma);
                }

                if (type === 'PURCHASE') {
                    for (const item of items) {
                        await prisma.product.update({
                            where: { id: item.productId },
                            data: { price: item.price },
                        });
                    }
                }
            }

            await this.customerBalanceService.updateCustomerBalance(
                customerId,
                finalAmount,
                type,
                prisma,
            );

            return transaction;
        });
    }
    async getTransactionsByUser(userId: string, field?: string, operator?: string, value?: string, endValue?: string) {
        const whereClause = await this.transactionFilterService.buildWhereClause(userId, field, operator, value, endValue);
        return this.transactionRepository.getTransactionsByUser(whereClause);
    }
    async getTransactionById(userId: string, transactionId: string) {
        return this.transactionRepository.getTransactionById(userId, transactionId);
    }

    async getProfitLast30Days(userId: string): Promise<Prisma.Decimal> {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const result = await this.prisma.transaction.aggregate({
            _sum: {
                profit: true,
            },
            where: {
                userId,
                type: 'SALE',
                createdAt: {
                    gte: thirtyDaysAgo,
                },
            },
        });

        return result._sum.profit ?? new Prisma.Decimal(0);
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

            // Revert old stock quantities and customer balance
            if (existingTransaction.type === 'SALE' || existingTransaction.type === 'PURCHASE') {
                await this.transactionStockService.revertStockForTransaction(
                    userId,
                    existingTransaction.items,
                    existingTransaction.type,
                    prisma,
                );
            }

            await this.customerBalanceService.revertCustomerBalance(
                existingTransaction.customerId,
                existingTransaction.finalAmount,
                existingTransaction.type,
                prisma,
            );

            const { type, discountAmount = 0, items, invoiceDate, dueDate, vatRate, currency } = dto;

            // Check new stock quantities
            if (type === 'SALE') {
                await this.transactionStockService.checkStockAvailability(userId, items, prisma);
            }

            const totalAmount = new Prisma.Decimal(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
            const finalAmount = new Prisma.Decimal(totalAmount.minus(discountAmount));

            let profit: Prisma.Decimal | null = null;
            if (type === 'SALE') {
                profit = await this.profitCalculationService.calculateProfit(items, prisma);
            }

            await prisma.transactionItem.deleteMany({ where: { transactionId } });

            if (items && items.length > 0) {
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
            }

            // Update stock with new quantities
            if (type === 'SALE' || type === 'PURCHASE') {
                await this.transactionStockService.updateStockForTransaction(userId, items, type, prisma);
            }

            if (type === 'PURCHASE') {
                for (const item of items) {
                    await prisma.product.update({
                        where: { id: item.productId },
                        data: { price: item.price },
                    });
                }
            }

            const updatedTransaction = await prisma.transaction.update({
                where: { id: transactionId },
                data: {
                    type,
                    totalAmount,
                    discountAmount: new Prisma.Decimal(discountAmount),
                    finalAmount,
                    profit,
                    invoiceDate: invoiceDate ? new Date(invoiceDate) : null,
                    dueDate: dueDate ? new Date(dueDate) : null,
                    vatRate,
                    currency,
                },
            });

            await this.customerBalanceService.updateCustomerBalance(
                updatedTransaction.customerId,
                finalAmount,
                type,
                prisma,
            );

            return updatedTransaction;
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

            // Revert stock quantities and customer balance before deleting the transaction
            if (transaction.type === 'SALE' || transaction.type === 'PURCHASE') {
                await this.transactionStockService.revertStockForTransaction(
                    userId,
                    transaction.items,
                    transaction.type,
                    prisma,
                );
            }

            await this.customerBalanceService.revertCustomerBalance(
                transaction.customerId,
                transaction.finalAmount,
                transaction.type,
                prisma,
            );

            await prisma.transactionItem.deleteMany({ where: { transactionId } });
            await prisma.transaction.delete({ where: { id: transactionId } });
        });
    }
}