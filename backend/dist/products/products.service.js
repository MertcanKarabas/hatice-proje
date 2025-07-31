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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../../generated/prisma/index.js");
const product_repository_interface_1 = require("../common/interfaces/product.repository.interface");
const product_filter_service_interface_1 = require("./interfaces/product-filter.service.interface");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    constructor(productRepository, productFilterService, prisma) {
        this.productRepository = productRepository;
        this.productFilterService = productFilterService;
        this.prisma = prisma;
    }
    async findAllByUser(userId, field, operator, value) {
        const whereClause = await this.productFilterService.buildWhereClause(userId, field, operator, value);
        return this.productRepository.findAllByUser(whereClause);
    }
    async findOne(userId, productId) {
        const product = await this.productRepository.findById(productId);
        if (!product || product.userId !== userId) {
            throw new common_1.NotFoundException(`Product with ID ${productId} not found or access denied.`);
        }
        return product;
    }
    async createProduct(userId, dto) {
        var _a, _b;
        const { components } = dto, productData = __rest(dto, ["components"]);
        if (dto.isPackage && (!components || components.length === 0)) {
            throw new common_1.ConflictException('Paket ürünler için bileşenler gereklidir.');
        }
        try {
            if (dto.isPackage) {
                for (const component of components) {
                    const product = await this.productRepository.findById(component.componentId);
                    if (!product || product.quantity < component.quantity * dto.quantity) {
                        throw new common_1.ConflictException(`Yetersiz stok: ${product.name}`);
                    }
                }
                return this.prisma.$transaction(async (prisma) => {
                    const newPackage = await prisma.product.create({
                        data: Object.assign(Object.assign({}, productData), { userId, price: new prisma_1.Prisma.Decimal(dto.price), packageComponents: {
                                create: components.map(c => (Object.assign(Object.assign({}, c), { componentId: c.componentId })))
                            } })
                    });
                    for (const component of components) {
                        await prisma.product.update({
                            where: { id: component.componentId },
                            data: { quantity: { decrement: component.quantity * dto.quantity } },
                        });
                    }
                    return newPackage;
                });
            }
            return await this.productRepository.create(Object.assign(Object.assign({ userId }, productData), { price: new prisma_1.Prisma.Decimal(dto.price) }));
        }
        catch (error) {
            if (error.code === 'P2002' && ((_b = (_a = error.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.includes('sku'))) {
                throw new common_1.ConflictException('Bu stok kodu (SKU) zaten mevcut.');
            }
            throw error;
        }
    }
    async updateProduct(userId, productId, dto) {
        const { components } = dto, productData = __rest(dto, ["components"]);
        return this.prisma.$transaction(async (prisma) => {
            const existingProduct = await prisma.product.findUnique({
                where: { id: productId },
                include: { packageComponents: true },
            });
            if (!existingProduct || existingProduct.userId !== userId) {
                throw new common_1.NotFoundException(`Product with ID ${productId} not found or access denied.`);
            }
            if (existingProduct.isPackage) {
                for (const component of existingProduct.packageComponents) {
                    await prisma.product.update({
                        where: { id: component.componentId },
                        data: { quantity: { increment: component.quantity * existingProduct.quantity } },
                    });
                }
            }
            if (dto.isPackage) {
                for (const component of components) {
                    const product = await prisma.product.findUnique({ where: { id: component.componentId } });
                    if (!product || product.quantity < component.quantity * dto.quantity) {
                        throw new common_1.ConflictException(`Yetersiz stok: ${product.name}`);
                    }
                    await prisma.product.update({
                        where: { id: component.componentId },
                        data: { quantity: { decrement: component.quantity * dto.quantity } },
                    });
                }
            }
            const updatedProduct = await prisma.product.update({
                where: { id: productId },
                data: Object.assign(Object.assign({}, productData), { price: new prisma_1.Prisma.Decimal(dto.price), packageComponents: {
                        deleteMany: {},
                        create: dto.isPackage ? components.map(c => (Object.assign(Object.assign({}, c), { componentId: c.componentId }))) : [],
                    } }),
            });
            return updatedProduct;
        });
    }
    async deleteProduct(userId, productId) {
        return this.prisma.$transaction(async (prisma) => {
            const existingProduct = await prisma.product.findUnique({
                where: { id: productId },
                include: { packageComponents: true, componentOfPackages: true },
            });
            if (!existingProduct || existingProduct.userId !== userId) {
                throw new common_1.NotFoundException(`Product with ID ${productId} not found or access denied.`);
            }
            if (existingProduct.componentOfPackages.length > 0) {
                throw new common_1.ConflictException('Bu ürün başka bir paketin parçası olduğu için silinemez.');
            }
            if (existingProduct.isPackage) {
                await prisma.productComponent.deleteMany({ where: { packageId: productId } });
            }
            await prisma.product.delete({ where: { id: productId } });
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [product_repository_interface_1.IProductRepository,
        product_filter_service_interface_1.IProductFilterService,
        prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map