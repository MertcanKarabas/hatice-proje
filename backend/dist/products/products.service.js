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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const prisma_1 = require("../../generated/prisma/index.js");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllByUser(userId, field, operator, value) {
        console.log("Field:", field);
        console.log("Operator:", operator);
        console.log("Value:", value);
        const where = { userId };
        if (!field || !operator || !value)
            return this.prisma.product.findMany({ where });
        const allowedFields = ['name', 'sku', 'price', 'quantity', 'currency', 'unit'];
        const allowedOperators = ['contains', 'equals', 'gt', 'lt'];
        if (!allowedFields.includes(field) || !allowedOperators.includes(operator)) {
            throw new common_1.BadRequestException('Geçersiz filtre');
        }
        function isNumericField(field) {
            const numericFields = ['price', 'quantity'];
            return numericFields.includes(field);
        }
        if (field && operator && value !== undefined) {
            const isNumeric = isNumericField(field);
            if (isNumeric) {
                const numericValue = Number(value);
                if (isNaN(numericValue)) {
                    throw new common_1.BadRequestException(`${field} sayısal bir değer olmalı`);
                }
                switch (operator) {
                    case 'equals':
                        where[field] = numericValue;
                        break;
                    case 'gt':
                        where[field] = { gt: numericValue };
                        break;
                    case 'lt':
                        where[field] = { lt: numericValue };
                        break;
                }
            }
            else {
                switch (operator) {
                    case 'contains':
                        where[field] = { contains: value, mode: 'insensitive' };
                        break;
                    case 'equals':
                        where[field] = value;
                        break;
                }
            }
        }
        console.log("WHERE:", where);
        return this.prisma.product.findMany({ where });
    }
    async createProduct(userId, dto) {
        return this.prisma.product.create({
            data: {
                userId,
                name: dto.name,
                description: dto.description,
                sku: dto.sku,
                barcode: dto.barcode,
                price: new prisma_1.Prisma.Decimal(dto.price),
                quantity: dto.quantity,
                unit: dto.unit,
                currency: dto.currency,
            },
        });
    }
    async updateProduct(userId, productId, dto) {
        return this.prisma.product.updateMany({
            where: {
                id: productId,
                userId,
            },
            data: {
                name: dto.name,
                description: dto.description,
                sku: dto.sku,
                barcode: dto.barcode,
                price: new prisma_1.Prisma.Decimal(dto.price),
                quantity: dto.quantity,
                unit: dto.unit,
                currency: dto.currency,
            },
        });
    }
    async deleteProduct(userId, productId) {
        return this.prisma.product.deleteMany({
            where: {
                id: productId,
                userId,
            },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map