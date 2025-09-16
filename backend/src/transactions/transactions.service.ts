import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ITransactionRepository } from 'src/common/interfaces/transaction.repository.interface';
import { ITransactionItemRepository } from 'src/common/interfaces/transaction-item.repository.interface';
import { Prisma, TransactionType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ITransactionFilterService } from './interfaces/transaction-filter.service.interface';
import { TransactionStockService } from './services/transaction-stock.service';
import { CustomerBalanceService } from './services/customer-balance.service';
import { ProfitCalculationService } from './services/profit-calculation.service';
import { CurrencyService } from 'src/currency/currency.service';

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
        private readonly currencyService: CurrencyService, // Inject CurrencyService
    ) { }

    async createTransaction(
        userId: string,
        dto: CreateTransactionDto,
    ) {
        return this.prisma.$transaction(async (prisma) => {
            const { type, discountAmount = 0, items, customerId, invoiceDate, dueDate, vatRate, totalAmount: dtoTotalAmount, finalAmount: dtoFinalAmount, exchangeId: exchangeCode } = dto;

            let actualExchangeId: string | undefined;
            if (exchangeCode) {
                const exchange = await this.prisma.exchange.findUnique({ where: { code: exchangeCode } });
                if (!exchange) {
                    throw new BadRequestException(`Exchange with code ${exchangeCode} not found.`);
                }
                actualExchangeId = exchange.id;
            }

            if (type === 'SALE') {
                await this.transactionStockService.checkStockAvailability(userId, items, prisma);
            }

            const calculatedTotalAmount = dtoTotalAmount !== undefined ? new Prisma.Decimal(dtoTotalAmount) : new Prisma.Decimal(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
            const calculatedFinalAmount = dtoFinalAmount !== undefined ? new Prisma.Decimal(dtoFinalAmount) : new Prisma.Decimal(calculatedTotalAmount.minus(discountAmount));

            let profit: Prisma.Decimal | null = null;
            if (type === 'SALE') {
                profit = await this.profitCalculationService.calculateProfit(items, prisma);
            }

            const { previousBalance, newBalance } = await this.customerBalanceService.updateCustomerBalance(
                customerId,
                calculatedFinalAmount,
                type,
                prisma,
                exchangeCode, // Pass exchangeCode
            );

            const transaction = await prisma.transaction.create({
                data: {
                    userId,
                    type,
                    customerId,
                    totalAmount: calculatedTotalAmount,
                    discountAmount: new Prisma.Decimal(discountAmount),
                    finalAmount: calculatedFinalAmount,
                    profit,
                    invoiceDate: invoiceDate ? new Date(invoiceDate) : null,
                    dueDate: dueDate ? new Date(dueDate) : null,
                    vatRate,
                    exchangeId: actualExchangeId, // Use actualExchangeId
                    customerPreviousBalance: previousBalance,
                    customerNewBalance: newBalance,
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

            return transaction;
        });
    }
    async getTransactionsByUser(userId: string, customerId?: string, field?: string, operator?: string, value?: string, endValue?: string) {
        const whereClause = await this.transactionFilterService.buildWhereClause(userId, customerId, field, operator, value, endValue);
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

    async getSalesOverview(userId: string) {
        const today = new Date();
        const startOfToday = new Date(today.setHours(0, 0, 0, 0));
        const endOfToday = new Date(today.setHours(23, 59, 59, 999));

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);

        const todaySales = await this.prisma.transaction.aggregate({
            _sum: {
                finalAmount: true,
            },
            where: {
                userId,
                type: 'SALE',
                createdAt: {
                    gte: startOfToday,
                    lte: endOfToday,
                },
            },
        });

        const thisWeekSales = await this.prisma.transaction.aggregate({
            _sum: {
                finalAmount: true,
            },
            where: {
                userId,
                type: 'SALE',
                createdAt: {
                    gte: startOfWeek,
                    lte: endOfWeek,
                },
            },
        });

        const thisMonthSales = await this.prisma.transaction.aggregate({
            _sum: {
                finalAmount: true,
            },
            where: {
                userId,
                type: 'SALE',
                createdAt: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
            },
        });

        return {
            today: todaySales._sum.finalAmount || 0,
            thisWeek: thisWeekSales._sum.finalAmount || 0,
            thisMonth: thisMonthSales._sum.finalAmount || 0,
        };
    }

    async getChartData(userId: string, startDate: string, endDate: string, dataTypes: string[]) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const chartData = new Map<string, { date: string; [key: string]: number | string }>();

        // Fetch transactions for relevant types
        const transactionTypesToFetch: TransactionType[] = [];
        if (dataTypes.includes('sales') || dataTypes.includes('profit')) transactionTypesToFetch.push(TransactionType.SALE);
        if (dataTypes.includes('purchases')) transactionTypesToFetch.push(TransactionType.PURCHASE);
        if (dataTypes.includes('collections')) transactionTypesToFetch.push(TransactionType.COLLECTION);
        if (dataTypes.includes('payments')) transactionTypesToFetch.push(TransactionType.PAYMENT);

        if (transactionTypesToFetch.length > 0) {
            const transactions = await this.prisma.transaction.findMany({
                where: {
                    userId,
                    type: { in: transactionTypesToFetch },
                    createdAt: {
                        gte: start,
                        lte: end,
                    },
                },
                select: {
                    createdAt: true,
                    finalAmount: true,
                    profit: true,
                    type: true,
                },
                orderBy: {
                    createdAt: 'asc',
                },
            });

            transactions.forEach(t => {
                const date = t.createdAt.toISOString().split('T')[0];
                if (!chartData.has(date)) {
                    const initialDayData: { date: string; [key: string]: number | string } = { date };
                    dataTypes.forEach(type => {
                        if (type !== 'date') {
                            initialDayData[type] = 0;
                        }
                    });
                    chartData.set(date, initialDayData);
                }
                const dayData = chartData.get(date);

                if (dataTypes.includes('profit')) {
                    dayData.profit = (Number(dayData.profit) || 0) + Number(t.profit || 0);
                }
                if (dataTypes.includes('sales') && t.type === 'SALE') {
                    dayData.sales = (Number(dayData.sales) || 0) + Number(t.finalAmount || 0);
                }
                if (dataTypes.includes('purchases') && t.type === 'PURCHASE') {
                    dayData.purchases = (Number(dayData.purchases) || 0) + Number(t.finalAmount || 0);
                }
                if (dataTypes.includes('collections') && t.type === 'COLLECTION') {
                    dayData.collections = (Number(dayData.collections) || 0) + Number(t.finalAmount || 0);
                }
                if (dataTypes.includes('payments') && t.type === 'PAYMENT') {
                    dayData.payments = (Number(dayData.payments) || 0) + Number(t.finalAmount || 0);
                }
            });
        }

        return Array.from(chartData.values());
    }

    async updateTransaction(userId: string, transactionId: string, dto: CreateTransactionDto) {
        return this.prisma.$transaction(async (prisma) => {
            const existingTransaction = await prisma.transaction.findUnique({
                where: { id: transactionId, userId },
                include: { items: true, exchange: true },
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
                existingTransaction.exchange?.code,
            );

            const { type, discountAmount = 0, items, customerId, invoiceDate, dueDate, vatRate, totalAmount: dtoTotalAmount, finalAmount: dtoFinalAmount, exchangeId: exchangeCode } = dto;

            let actualExchangeId: string | undefined;
            if (exchangeCode) {
                const exchange = await this.prisma.exchange.findUnique({ where: { code: exchangeCode } });
                if (!exchange) {
                    throw new BadRequestException(`Exchange with code ${exchangeCode} not found.`);
                }
                actualExchangeId = exchange.id;
            }

            const calculatedTotalAmount = dtoTotalAmount !== undefined ? new Prisma.Decimal(dtoTotalAmount) : new Prisma.Decimal(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
            const calculatedFinalAmount = dtoFinalAmount !== undefined ? new Prisma.Decimal(dtoFinalAmount) : new Prisma.Decimal(calculatedTotalAmount.minus(discountAmount));

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

            const { previousBalance, newBalance } = await this.customerBalanceService.updateCustomerBalance(
                existingTransaction.customerId,
                calculatedFinalAmount,
                type,
                prisma,
                exchangeCode, // Pass exchangeCode
            );

            const updatedTransaction = await prisma.transaction.update({
                where: { id: transactionId },
                data: {
                    type,
                    totalAmount: calculatedTotalAmount,
                    discountAmount: new Prisma.Decimal(discountAmount),
                    finalAmount: calculatedFinalAmount,
                    profit,
                    invoiceDate: invoiceDate ? new Date(invoiceDate) : null,
                    dueDate: dueDate ? new Date(dueDate) : null,
                    vatRate,
                    exchangeId: actualExchangeId, // Use actualExchangeId
                    customerPreviousBalance: previousBalance,
                    customerNewBalance: newBalance,
                },
            });

            return updatedTransaction;
        });
    }

    async deleteTransaction(userId: string, transactionId: string) {
        await this.prisma.$transaction(async (prisma) => {
            const transaction = await prisma.transaction.findUnique({
                where: { id: transactionId, userId },
                include: { items: true, exchange: true },
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
                transaction.exchange?.code,
            );

            await prisma.transactionItem.deleteMany({ where: { transactionId } });
            await prisma.transaction.delete({ where: { id: transactionId } });
        });
    }
}