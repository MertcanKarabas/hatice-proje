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
exports.ProductStockService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ProductStockService = class ProductStockService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkAndDecrementStockForPackageCreation(userId, components, packageQuantity) {
        for (const component of components) {
            const componentStock = await this.prisma.stock.findUnique({
                where: { productId_userId: { productId: component.componentId, userId } },
                include: { product: { select: { name: true } } },
            });
            const requiredQuantity = component.quantity * packageQuantity;
            if (!componentStock || componentStock.quantity < requiredQuantity) {
                const productName = (componentStock === null || componentStock === void 0 ? void 0 : componentStock.product.name) || `ID: ${component.componentId}`;
                throw new common_1.ConflictException(`Insufficient stock for component: ${productName}`);
            }
        }
        for (const component of components) {
            await this.prisma.stock.update({
                where: { productId_userId: { productId: component.componentId, userId } },
                data: {
                    quantity: { decrement: component.quantity * packageQuantity },
                },
            });
        }
    }
    async createStockForNewProduct(userId, productId, quantity) {
        await this.prisma.stock.create({
            data: {
                userId,
                productId,
                quantity,
            },
        });
    }
    async restoreStockForOldPackageComponents(existingProduct, prismaTransaction) {
        if (existingProduct.isPackage) {
            for (const component of existingProduct.packageComponents) {
                await prismaTransaction.product.update({
                    where: { id: component.componentId },
                    data: { quantity: { increment: component.quantity * existingProduct.quantity } },
                });
            }
        }
    }
    async deductStockForNewPackageComponents(userId, components, packageQuantity, prismaTransaction) {
        for (const component of components) {
            const product = await prismaTransaction.product.findUnique({ where: { id: component.componentId } });
            if (!product || product.quantity < component.quantity * packageQuantity) {
                throw new common_1.ConflictException(`Insufficient stock: ${product.name}`);
            }
            await prismaTransaction.product.update({
                where: { id: component.componentId },
                data: { quantity: { decrement: component.quantity * packageQuantity } },
            });
        }
    }
    async revertStockForTransaction(userId, items, transactionType, prismaTransaction) {
        for (const item of items) {
            const existingStock = await prismaTransaction.stock.findFirst({
                where: { productId: item.productId, userId },
            });
            if (existingStock) {
                const newQuantity = transactionType === 'SALE'
                    ? existingStock.quantity + item.quantity
                    : existingStock.quantity - item.quantity;
                await prismaTransaction.stock.update({
                    where: { id: existingStock.id },
                    data: { quantity: newQuantity },
                });
            }
        }
    }
    async updateStockForTransaction(userId, items, transactionType, prismaTransaction) {
        for (const item of items) {
            const existingStock = await prismaTransaction.stock.findFirst({
                where: { productId: item.productId, userId },
            });
            if (existingStock) {
                const newQuantity = transactionType === 'PURCHASE'
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
                if (transactionType === 'SALE') {
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
};
exports.ProductStockService = ProductStockService;
exports.ProductStockService = ProductStockService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductStockService);
//# sourceMappingURL=product-stock.service.js.map