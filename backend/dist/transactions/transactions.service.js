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
const prisma_service_1 = require("../prisma/prisma.service");
const common_2 = require("@nestjs/common");
let TransactionsService = class TransactionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTransaction(userId, dto) {
        const { type, discountAmount = 0, items } = dto;
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const finalAmount = totalAmount - discountAmount;
        return this.prisma.$transaction(async (tx) => {
            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    type,
                    totalAmount,
                    discountAmount,
                    finalAmount,
                },
            });
            await tx.transactionItem.createMany({
                data: items.map((item) => ({
                    transactionId: transaction.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                })),
            });
            for (const item of items) {
                const existingStock = await tx.stock.findFirst({
                    where: {
                        userId,
                        productId: item.productId,
                    },
                });
                if (existingStock) {
                    await tx.stock.update({
                        where: { id: existingStock.id },
                        data: {
                            quantity: type === 'PURCHASE'
                                ? existingStock.quantity + item.quantity
                                : existingStock.quantity - item.quantity,
                        },
                    });
                }
                else {
                    if (type === 'SALE' && !existingStock) {
                        throw new common_2.BadRequestException(`Stok bulunamadı: ${item.productId}`);
                    }
                    await tx.stock.create({
                        data: {
                            userId,
                            productId: item.productId,
                            quantity: item.quantity,
                        },
                    });
                }
            }
            return transaction;
        });
    }
    async getTransactionsByUser(userId) {
        return this.prisma.transaction.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                payments: true,
                discounts: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async getTransactionById(userId, transactionId) {
        return this.prisma.transaction.findFirst({
            where: {
                id: transactionId,
                userId,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                payments: true,
                discounts: true,
            },
        });
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map