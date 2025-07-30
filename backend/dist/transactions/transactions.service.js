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
let TransactionsService = class TransactionsService {
    constructor(transactionRepository, transactionItemRepository, stockService) {
        this.transactionRepository = transactionRepository;
        this.transactionItemRepository = transactionItemRepository;
        this.stockService = stockService;
    }
    async createTransaction(userId, dto) {
        const { type, discountAmount = 0, items } = dto;
        const totalAmount = new prisma_1.Prisma.Decimal(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
        const finalAmount = new prisma_1.Prisma.Decimal(totalAmount.minus(discountAmount));
        const transaction = await this.transactionRepository.create({
            userId,
            type,
            totalAmount,
            discountAmount: new prisma_1.Prisma.Decimal(discountAmount),
            finalAmount,
        });
        await this.transactionItemRepository.createMany(items.map((item) => ({
            transactionId: transaction.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
        })));
        for (const item of items) {
            await this.stockService.updateStock(userId, item.productId, item.quantity, type);
        }
        return transaction;
    }
    async getTransactionsByUser(userId) {
        return this.transactionRepository.getTransactionsByUser(userId);
    }
    async getTransactionById(userId, transactionId) {
        return this.transactionRepository.getTransactionById(userId, transactionId);
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transaction_repository_interface_1.ITransactionRepository,
        transaction_item_repository_interface_1.ITransactionItemRepository,
        stock_service_1.StockService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map