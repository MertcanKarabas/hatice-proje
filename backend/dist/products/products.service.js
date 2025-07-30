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
const prisma_1 = require("../../generated/prisma/index.js");
const product_repository_interface_1 = require("../common/interfaces/product.repository.interface");
const product_filter_service_interface_1 = require("./interfaces/product-filter.service.interface");
let ProductsService = class ProductsService {
    constructor(productRepository, productFilterService) {
        this.productRepository = productRepository;
        this.productFilterService = productFilterService;
    }
    async findAllByUser(userId, field, operator, value) {
        const whereClause = await this.productFilterService.buildWhereClause(userId, field, operator, value);
        return this.productRepository.findAllByUser(whereClause);
    }
    async createProduct(userId, dto) {
        return this.productRepository.create({
            userId,
            name: dto.name,
            description: dto.description,
            sku: dto.sku,
            barcode: dto.barcode,
            price: new prisma_1.Prisma.Decimal(dto.price),
            quantity: dto.quantity,
            unit: dto.unit,
            currency: dto.currency,
        });
    }
    async updateProduct(userId, productId, dto) {
        const existingProduct = await this.productRepository.findById(productId);
        if (!existingProduct || existingProduct.userId !== userId) {
            throw new common_1.NotFoundException(`Product with ID ${productId} not found or access denied.`);
        }
        return this.productRepository.update(productId, {
            name: dto.name,
            description: dto.description,
            sku: dto.sku,
            barcode: dto.barcode,
            price: new prisma_1.Prisma.Decimal(dto.price),
            quantity: dto.quantity,
            unit: dto.unit,
            currency: dto.currency,
        });
    }
    async deleteProduct(userId, productId) {
        const existingProduct = await this.productRepository.findById(productId);
        if (!existingProduct || existingProduct.userId !== userId) {
            throw new common_1.NotFoundException(`Product with ID ${productId} not found or access denied.`);
        }
        return this.productRepository.delete(productId);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [product_repository_interface_1.IProductRepository,
        product_filter_service_interface_1.IProductFilterService])
], ProductsService);
//# sourceMappingURL=products.service.js.map