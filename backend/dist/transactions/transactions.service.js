"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const transaction_repository_interface_1 = require("../common/interfaces/transaction.repository.interface");
const transaction_item_repository_interface_1 = require("../common/interfaces/transaction-item.repository.interface");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const transaction_filter_service_interface_1 = require("./interfaces/transaction-filter.service.interface");
const transaction_stock_service_1 = require("./services/transaction-stock.service");
const customer_balance_service_1 = require("./services/customer-balance.service");
const profit_calculation_service_1 = require("./services/profit-calculation.service");
const currency_service_1 = require("../currency/currency.service");
let TransactionsService = class TransactionsService {
    constructor(transactionRepository, transactionItemRepository, prisma, transactionFilterService, transactionStockService, customerBalanceService, profitCalculationService, currencyService) {
        this.transactionRepository = transactionRepository;
        this.transactionItemRepository = transactionItemRepository;
        this.prisma = prisma;
        this.transactionFilterService = transactionFilterService;
        this.transactionStockService = transactionStockService;
        this.customerBalanceService = customerBalanceService;
        this.profitCalculationService = profitCalculationService;
        this.currencyService = currencyService;
    }
    async createTransaction(userId, dto) {
        return this.prisma.$transaction(async (prisma) => {
            const { type, discountAmount = 0, items, customerId, invoiceDate, dueDate, vatRate, totalAmount: dtoTotalAmount, finalAmount: dtoFinalAmount, exchangeId: exchangeCode } = dto;
            let actualExchangeId;
            if (exchangeCode) {
                const exchange = await this.prisma.exchange.findUnique({ where: { code: exchangeCode } });
                if (!exchange) {
                    throw new common_1.BadRequestException(`Exchange with code ${exchangeCode} not found.`);
                }
                actualExchangeId = exchange.id;
            }
            if (type === 'SALE') {
                await this.transactionStockService.checkStockAvailability(userId, items, prisma);
            }
            const calculatedTotalAmount = dtoTotalAmount !== undefined ? new client_1.Prisma.Decimal(dtoTotalAmount) : new client_1.Prisma.Decimal(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
            const calculatedFinalAmount = dtoFinalAmount !== undefined ? new client_1.Prisma.Decimal(dtoFinalAmount) : new client_1.Prisma.Decimal(calculatedTotalAmount.minus(discountAmount));
            let profit = null;
            if (type === 'SALE') {
                profit = await this.profitCalculationService.calculateProfit(items, prisma);
            }
            const { previousBalance, newBalance } = await this.customerBalanceService.updateCustomerBalance(customerId, calculatedFinalAmount, type, prisma, exchangeCode);
            const transaction = await prisma.transaction.create({
                data: {
                    userId,
                    type,
                    customerId,
                    totalAmount: calculatedTotalAmount,
                    discountAmount: new client_1.Prisma.Decimal(discountAmount),
                    finalAmount: calculatedFinalAmount,
                    profit,
                    invoiceDate: invoiceDate ? new Date(invoiceDate) : null,
                    dueDate: dueDate ? new Date(dueDate) : null,
                    vatRate,
                    exchangeId: actualExchangeId,
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
    async getTransactionsByUser(userId, customerId, field, operator, value, endValue) {
        const whereClause = await this.transactionFilterService.buildWhereClause(userId, customerId, field, operator, value, endValue);
        return this.transactionRepository.getTransactionsByUser(whereClause);
    }
    async getTransactionById(userId, transactionId) {
        return this.transactionRepository.getTransactionById(userId, transactionId);
    }
    async getProfitLast30Days(userId) {
        var _a;
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
        return (_a = result._sum.profit) !== null && _a !== void 0 ? _a : new client_1.Prisma.Decimal(0);
    }
    async getSalesOverview(userId) {
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
    async getChartData(userId, startDate, endDate, dataTypes) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        const chartData = new Map();
        const transactionTypesToFetch = [];
        if (dataTypes.includes('sales') || dataTypes.includes('profit'))
            transactionTypesToFetch.push(client_1.TransactionType.SALE);
        if (dataTypes.includes('purchases'))
            transactionTypesToFetch.push(client_1.TransactionType.PURCHASE);
        if (dataTypes.includes('collections'))
            transactionTypesToFetch.push(client_1.TransactionType.COLLECTION);
        if (dataTypes.includes('payments'))
            transactionTypesToFetch.push(client_1.TransactionType.PAYMENT);
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
                    const initialDayData = { date };
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
    async updateTransaction(userId, transactionId, dto) {
        return this.prisma.$transaction(async (prisma) => {
            var _a;
            const existingTransaction = await prisma.transaction.findUnique({
                where: { id: transactionId, userId },
                include: { items: true, exchange: true },
            });
            if (!existingTransaction) {
                throw new common_1.NotFoundException(`Transaction with ID ${transactionId} not found or access denied.`);
            }
            if (existingTransaction.type === 'SALE' || existingTransaction.type === 'PURCHASE') {
                await this.transactionStockService.revertStockForTransaction(userId, existingTransaction.items, existingTransaction.type, prisma);
            }
            await this.customerBalanceService.revertCustomerBalance(existingTransaction.customerId, existingTransaction.finalAmount, existingTransaction.type, prisma, (_a = existingTransaction.exchange) === null || _a === void 0 ? void 0 : _a.code);
            const { type, discountAmount = 0, items, customerId, invoiceDate, dueDate, vatRate, totalAmount: dtoTotalAmount, finalAmount: dtoFinalAmount, exchangeId: exchangeCode } = dto;
            let actualExchangeId;
            if (exchangeCode) {
                const exchange = await this.prisma.exchange.findUnique({ where: { code: exchangeCode } });
                if (!exchange) {
                    throw new common_1.BadRequestException(`Exchange with code ${exchangeCode} not found.`);
                }
                actualExchangeId = exchange.id;
            }
            const calculatedTotalAmount = dtoTotalAmount !== undefined ? new client_1.Prisma.Decimal(dtoTotalAmount) : new client_1.Prisma.Decimal(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
            const calculatedFinalAmount = dtoFinalAmount !== undefined ? new client_1.Prisma.Decimal(dtoFinalAmount) : new client_1.Prisma.Decimal(calculatedTotalAmount.minus(discountAmount));
            let profit = null;
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
            const { previousBalance, newBalance } = await this.customerBalanceService.updateCustomerBalance(existingTransaction.customerId, calculatedFinalAmount, type, prisma, exchangeCode);
            const updatedTransaction = await prisma.transaction.update({
                where: { id: transactionId },
                data: {
                    type,
                    totalAmount: calculatedTotalAmount,
                    discountAmount: new client_1.Prisma.Decimal(discountAmount),
                    finalAmount: calculatedFinalAmount,
                    profit,
                    invoiceDate: invoiceDate ? new Date(invoiceDate) : null,
                    dueDate: dueDate ? new Date(dueDate) : null,
                    vatRate,
                    exchangeId: actualExchangeId,
                    customerPreviousBalance: previousBalance,
                    customerNewBalance: newBalance,
                },
            });
            return updatedTransaction;
        });
    }
    async deleteTransaction(userId, transactionId) {
        await this.prisma.$transaction(async (prisma) => {
            var _a;
            const transaction = await prisma.transaction.findUnique({
                where: { id: transactionId, userId },
                include: { items: true, exchange: true },
            });
            if (!transaction) {
                throw new common_1.NotFoundException(`Transaction with ID ${transactionId} not found or access denied.`);
            }
            if (transaction.type === 'SALE' || transaction.type === 'PURCHASE') {
                await this.transactionStockService.revertStockForTransaction(userId, transaction.items, transaction.type, prisma);
            }
            await this.customerBalanceService.revertCustomerBalance(transaction.customerId, transaction.finalAmount, transaction.type, prisma, (_a = transaction.exchange) === null || _a === void 0 ? void 0 : _a.code);
            await prisma.transactionItem.deleteMany({ where: { transactionId } });
            await prisma.transaction.delete({ where: { id: transactionId } });
        });
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transaction_repository_interface_1.ITransactionRepository,
        transaction_item_repository_interface_1.ITransactionItemRepository,
        prisma_service_1.PrismaService,
        transaction_filter_service_interface_1.ITransactionFilterService,
        transaction_stock_service_1.TransactionStockService,
        customer_balance_service_1.CustomerBalanceService,
        profit_calculation_service_1.ProfitCalculationService,
        currency_service_1.CurrencyService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map