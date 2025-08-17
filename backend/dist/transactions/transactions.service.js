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
const stock_service_1 = require("../stock/stock.service");
const prisma_1 = require("../../generated/prisma/index.js");
const prisma_service_1 = require("../prisma/prisma.service");
const customer_repository_1 = require("../customers/repositories/customer.repository");
const transaction_filter_service_interface_1 = require("./interfaces/transaction-filter.service.interface");
let TransactionsService = class TransactionsService {
    constructor(transactionRepository, transactionItemRepository, stockService, prisma, customerRepository, transactionFilterService) {
        this.transactionRepository = transactionRepository;
        this.transactionItemRepository = transactionItemRepository;
        this.stockService = stockService;
        this.prisma = prisma;
        this.customerRepository = customerRepository;
        this.transactionFilterService = transactionFilterService;
    }
    async createTransaction(userId, dto) {
        return this.prisma.$transaction(async (prisma) => {
            var _a;
            const { type, discountAmount = 0, items, customerId, invoiceDate, dueDate, vatRate, currency } = dto;
            if (type === 'SALE') {
                for (const item of items) {
                    const stock = await prisma.stock.findFirst({ where: { productId: item.productId, userId } });
                    if (!stock || stock.quantity < item.quantity) {
                        const product = await prisma.product.findUnique({ where: { id: item.productId } });
                        throw new common_1.BadRequestException(`Yetersiz stok: ${(_a = product === null || product === void 0 ? void 0 : product.name) !== null && _a !== void 0 ? _a : item.productId}`);
                    }
                }
            }
            const totalAmount = new prisma_1.Prisma.Decimal(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
            const finalAmount = new prisma_1.Prisma.Decimal(totalAmount.minus(discountAmount));
            let profit = new prisma_1.Prisma.Decimal(0);
            if (type === 'SALE') {
                for (const item of items) {
                    const product = await prisma.product.findUnique({ where: { id: item.productId } });
                    if (!product) {
                        throw new common_1.NotFoundException(`Product with ID ${item.productId} not found.`);
                    }
                    const itemProfit = new prisma_1.Prisma.Decimal(item.price).minus(product.price).times(item.quantity);
                    if (product.currency === 'TRY') {
                        profit = profit.plus(itemProfit);
                    }
                    else {
                        const exchangeRate = await prisma.exchange.findUnique({ where: { code: product.currency } });
                        if (!exchangeRate) {
                            throw new common_1.NotFoundException(`Exchange rate for ${product.currency} not found.`);
                        }
                        profit = profit.plus(itemProfit.times(exchangeRate.rate));
                    }
                }
            }
            const transaction = await prisma.transaction.create({
                data: {
                    userId,
                    type,
                    customerId,
                    totalAmount,
                    discountAmount: new prisma_1.Prisma.Decimal(discountAmount),
                    finalAmount,
                    profit: type === 'SALE' ? profit : null,
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
                    for (const item of items) {
                        await this.stockService.updateStock(userId, item.productId, item.quantity, type);
                    }
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
            if (customerId) {
                const customer = await prisma.customer.findUnique({ where: { id: customerId } });
                if (customer) {
                    let newBalance = new prisma_1.Prisma.Decimal(customer.balance);
                    if (transaction.type === prisma_1.TransactionType.SALE) {
                        newBalance = newBalance.plus(finalAmount);
                    }
                    else if (transaction.type === prisma_1.TransactionType.PURCHASE) {
                        newBalance = newBalance.minus(finalAmount);
                    }
                    await prisma.customer.update({ where: { id: customerId }, data: { balance: newBalance } });
                }
            }
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
            var _a;
            const existingTransaction = await prisma.transaction.findUnique({
                where: { id: transactionId, userId },
                include: { items: true },
            });
            if (!existingTransaction) {
                throw new common_1.NotFoundException(`Transaction with ID ${transactionId} not found or access denied.`);
            }
            if (existingTransaction.type === 'SALE' || existingTransaction.type === 'PURCHASE') {
                for (const item of existingTransaction.items) {
                    await this.stockService.updateStock(userId, item.productId, -item.quantity, existingTransaction.type);
                }
            }
            if (existingTransaction.customerId) {
                const customer = await prisma.customer.findUnique({ where: { id: existingTransaction.customerId } });
                if (customer) {
                    let oldBalance = new prisma_1.Prisma.Decimal(customer.balance);
                    if (existingTransaction.type === prisma_1.TransactionType.SALE) {
                        oldBalance = oldBalance.minus(existingTransaction.finalAmount);
                    }
                    else if (existingTransaction.type === prisma_1.TransactionType.PURCHASE) {
                        oldBalance = oldBalance.plus(existingTransaction.finalAmount);
                    }
                    await prisma.customer.update({ where: { id: existingTransaction.customerId }, data: { balance: oldBalance } });
                }
            }
            const { type, discountAmount = 0, items, invoiceDate, dueDate, vatRate, currency } = dto;
            if (type === 'SALE') {
                for (const item of items) {
                    const stock = await prisma.stock.findFirst({ where: { productId: item.productId, userId } });
                    if (!stock || stock.quantity < item.quantity) {
                        const product = await prisma.product.findUnique({ where: { id: item.productId } });
                        throw new common_1.BadRequestException(`Yetersiz stok: ${(_a = product === null || product === void 0 ? void 0 : product.name) !== null && _a !== void 0 ? _a : item.productId}`);
                    }
                }
            }
            const totalAmount = new prisma_1.Prisma.Decimal(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
            const finalAmount = new prisma_1.Prisma.Decimal(totalAmount.minus(discountAmount));
            let profit = new prisma_1.Prisma.Decimal(0);
            if (type === 'SALE') {
                for (const item of items) {
                    const product = await prisma.product.findUnique({ where: { id: item.productId } });
                    if (!product) {
                        throw new common_1.NotFoundException(`Product with ID ${item.productId} not found.`);
                    }
                    const itemProfit = new prisma_1.Prisma.Decimal(item.price).minus(product.price).times(item.quantity);
                    if (product.currency === 'TRY') {
                        profit = profit.plus(itemProfit);
                    }
                    else {
                        const exchangeRate = await prisma.exchange.findUnique({ where: { code: product.currency } });
                        if (!exchangeRate) {
                            throw new common_1.NotFoundException(`Exchange rate for ${product.currency} not found.`);
                        }
                        profit = profit.plus(itemProfit.times(exchangeRate.rate));
                    }
                }
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
                for (const item of items) {
                    await this.stockService.updateStock(userId, item.productId, item.quantity, type);
                }
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
                    profit: type === 'SALE' ? profit : null,
                    invoiceDate: invoiceDate ? new Date(invoiceDate) : null,
                    dueDate: dueDate ? new Date(dueDate) : null,
                    vatRate,
                    currency,
                },
            });
            if (updatedTransaction.customerId) {
                const customer = await prisma.customer.findUnique({ where: { id: updatedTransaction.customerId } });
                if (customer) {
                    let newBalance = new prisma_1.Prisma.Decimal(customer.balance);
                    if (updatedTransaction.type === prisma_1.TransactionType.SALE) {
                        newBalance = newBalance.plus(finalAmount);
                    }
                    else if (updatedTransaction.type === prisma_1.TransactionType.PURCHASE) {
                        newBalance = newBalance.minus(finalAmount);
                    }
                    await prisma.customer.update({ where: { id: updatedTransaction.customerId }, data: { balance: newBalance } });
                }
            }
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
                for (const item of transaction.items) {
                    await this.stockService.updateStock(userId, item.productId, -item.quantity, transaction.type);
                }
            }
            if (transaction.customerId) {
                const customer = await prisma.customer.findUnique({ where: { id: transaction.customerId } });
                if (customer) {
                    let oldBalance = new prisma_1.Prisma.Decimal(customer.balance);
                    if (transaction.type === prisma_1.TransactionType.SALE) {
                        oldBalance = oldBalance.minus(transaction.finalAmount);
                    }
                    else if (transaction.type === prisma_1.TransactionType.PURCHASE) {
                        oldBalance = oldBalance.plus(transaction.finalAmount);
                    }
                    await prisma.customer.update({ where: { id: transaction.customerId }, data: { balance: oldBalance } });
                }
            }
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
        stock_service_1.StockService,
        prisma_service_1.PrismaService,
        customer_repository_1.CustomerRepository,
        transaction_filter_service_interface_1.ITransactionFilterService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map