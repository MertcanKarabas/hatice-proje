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
const prisma_1 = require("../../generated/prisma/index.js");
const prisma_service_1 = require("../prisma/prisma.service");
const transaction_filter_service_interface_1 = require("./interfaces/transaction-filter.service.interface");
const transaction_stock_service_1 = require("./services/transaction-stock.service");
const customer_balance_service_1 = require("./services/customer-balance.service");
const profit_calculation_service_1 = require("./services/profit-calculation.service");
let TransactionsService = class TransactionsService {
    constructor(transactionRepository, transactionItemRepository, prisma, transactionFilterService, transactionStockService, customerBalanceService, profitCalculationService) {
        this.transactionRepository = transactionRepository;
        this.transactionItemRepository = transactionItemRepository;
        this.prisma = prisma;
        this.transactionFilterService = transactionFilterService;
        this.transactionStockService = transactionStockService;
        this.customerBalanceService = customerBalanceService;
        this.profitCalculationService = profitCalculationService;
    }
    async createTransaction(userId, dto) {
        return this.prisma.$transaction(async (prisma) => {
            const { type, discountAmount = 0, items, customerId, invoiceDate, dueDate, vatRate, currency } = dto;
            if (type === 'SALE') {
                await this.transactionStockService.checkStockAvailability(userId, items, prisma);
            }
            const totalAmount = new prisma_1.Prisma.Decimal(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
            const finalAmount = new prisma_1.Prisma.Decimal(totalAmount.minus(discountAmount));
            let profit = null;
            if (type === 'SALE') {
                profit = await this.profitCalculationService.calculateProfit(items, prisma);
            }
            const transaction = await prisma.transaction.create({
                data: {
                    userId,
                    type,
                    customerId,
                    totalAmount,
                    discountAmount: new prisma_1.Prisma.Decimal(discountAmount),
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
            await this.customerBalanceService.updateCustomerBalance(customerId, finalAmount, type, prisma);
            return transaction;
        });
    }
    async getTransactionsByUser(userId, field, operator, value, endValue) {
        const whereClause = await this.transactionFilterService.buildWhereClause(userId, field, operator, value, endValue);
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
        return (_a = result._sum.profit) !== null && _a !== void 0 ? _a : new prisma_1.Prisma.Decimal(0);
    }
    async updateTransaction(userId, transactionId, dto) {
        return this.prisma.$transaction(async (prisma) => {
            const existingTransaction = await prisma.transaction.findUnique({
                where: { id: transactionId, userId },
                include: { items: true },
            });
            if (!existingTransaction) {
                throw new common_1.NotFoundException(`Transaction with ID ${transactionId} not found or access denied.`);
            }
            if (existingTransaction.type === 'SALE' || existingTransaction.type === 'PURCHASE') {
                await this.transactionStockService.revertStockForTransaction(userId, existingTransaction.items, existingTransaction.type, prisma);
            }
            await this.customerBalanceService.revertCustomerBalance(existingTransaction.customerId, existingTransaction.finalAmount, existingTransaction.type, prisma);
            const { type, discountAmount = 0, items, invoiceDate, dueDate, vatRate, currency } = dto;
            if (type === 'SALE') {
                await this.transactionStockService.checkStockAvailability(userId, items, prisma);
            }
            const totalAmount = new prisma_1.Prisma.Decimal(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
            const finalAmount = new prisma_1.Prisma.Decimal(totalAmount.minus(discountAmount));
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
            const updatedTransaction = await prisma.transaction.update({
                where: { id: transactionId },
                data: {
                    type,
                    totalAmount,
                    discountAmount: new prisma_1.Prisma.Decimal(discountAmount),
                    finalAmount,
                    profit,
                    invoiceDate: invoiceDate ? new Date(invoiceDate) : null,
                    dueDate: dueDate ? new Date(dueDate) : null,
                    vatRate,
                    currency,
                },
            });
            await this.customerBalanceService.updateCustomerBalance(updatedTransaction.customerId, finalAmount, type, prisma);
            return updatedTransaction;
        });
    }
    async deleteTransaction(userId, transactionId) {
        await this.prisma.$transaction(async (prisma) => {
            const transaction = await prisma.transaction.findUnique({
                where: { id: transactionId, userId },
                include: { items: true },
            });
            if (!transaction) {
                throw new common_1.NotFoundException(`Transaction with ID ${transactionId} not found or access denied.`);
            }
            if (transaction.type === 'SALE' || transaction.type === 'PURCHASE') {
                await this.transactionStockService.revertStockForTransaction(userId, transaction.items, transaction.type, prisma);
            }
            await this.customerBalanceService.revertCustomerBalance(transaction.customerId, transaction.finalAmount, transaction.type, prisma);
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
        profit_calculation_service_1.ProfitCalculationService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map