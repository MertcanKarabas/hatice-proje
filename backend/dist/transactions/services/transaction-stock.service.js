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
exports.TransactionStockService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let TransactionStockService = class TransactionStockService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkStockAvailability(userId, items, prismaTransaction) {
        var _a;
        for (const item of items) {
            const stock = await prismaTransaction.stock.findFirst({ where: { productId: item.productId, userId } });
            if (!stock || stock.quantity < item.quantity) {
                const product = await prismaTransaction.product.findUnique({ where: { id: item.productId } });
                throw new common_1.BadRequestException(`Insufficient stock: ${(_a = product === null || product === void 0 ? void 0 : product.name) !== null && _a !== void 0 ? _a : item.productId}`);
            }
        }
    }
    async updateStockForTransaction(userId, items, type, prismaTransaction) {
        for (const item of items) {
            const existingStock = await prismaTransaction.stock.findFirst({
                where: { productId: item.productId, userId },
            });
            if (existingStock) {
                const newQuantity = type === 'PURCHASE'
                    ? existingStock.quantity + item.quantity
                    : existingStock.quantity - item.quantity;
                if (newQuantity < 0) {
                    throw new common_1.BadRequestException(`Insufficient stock for product ${item.productId}`);
                }
                await prismaTransaction.stock.update({
                    where: { id: existingStock.id },
                    data: { quantity: newQuantity },
                });
            }
            else {
                if (type === 'SALE') {
                    throw new common_1.BadRequestException(`Stock not found for product ${item.productId}`);
                }
                await prismaTransaction.stock.create({
                    data: {
                        userId,
                        productId: item.productId,
                        quantity: item.quantity,
                    },
                });
            }
        }
    }
    async revertStockForTransaction(userId, items, type, prismaTransaction) {
        for (const item of items) {
            const existingStock = await prismaTransaction.stock.findFirst({
                where: { productId: item.productId, userId },
            });
            if (existingStock) {
                const newQuantity = type === 'SALE'
                    ? existingStock.quantity + item.quantity
                    : existingStock.quantity - item.quantity;
                await prismaTransaction.stock.update({
                    where: { id: existingStock.id },
                    data: { quantity: newQuantity },
                });
            }
        }
    }
};
exports.TransactionStockService = TransactionStockService;
exports.TransactionStockService = TransactionStockService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionStockService);
//# sourceMappingURL=transaction-stock.service.js.map