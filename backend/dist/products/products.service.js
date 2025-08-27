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
const client_1 = require("@prisma/client");
const product_repository_interface_1 = require("../common/interfaces/product.repository.interface");
const product_filter_service_interface_1 = require("./interfaces/product-filter.service.interface");
const prisma_service_1 = require("../prisma/prisma.service");
const product_stock_service_1 = require("./services/product-stock.service");
let ProductsService = class ProductsService {
    constructor(productRepository, productFilterService, prisma, productStockService) {
        this.productRepository = productRepository;
        this.productFilterService = productFilterService;
        this.prisma = prisma;
        this.productStockService = productStockService;
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
        try {
            if (dto.isPackage) {
                if (!components || components.length === 0) {
                    throw new common_1.ConflictException('Paket ürünler için bileşenler gereklidir.');
                }
                return this.prisma.$transaction(async (prisma) => {
                    await this.productStockService.checkAndDecrementStockForPackageCreation(userId, components, dto.quantity);
                    const newPackage = await prisma.product.create({
                        data: Object.assign(Object.assign({}, productData), { userId, price: new client_1.Prisma.Decimal(dto.price), quantity: dto.quantity, packageComponents: {
                                create: components.map(c => ({
                                    componentId: c.componentId,
                                    quantity: c.quantity,
                                })),
                            } }),
                    });
                    await this.productStockService.createStockForNewProduct(userId, newPackage.id, dto.quantity);
                    return newPackage;
                });
            }
            return this.prisma.$transaction(async (prisma) => {
                const newProduct = await prisma.product.create({
                    data: Object.assign(Object.assign({ userId }, productData), { price: new client_1.Prisma.Decimal(dto.price), quantity: dto.quantity }),
                });
                await this.productStockService.createStockForNewProduct(userId, newProduct.id, dto.quantity);
                return newProduct;
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002' &&
                    Array.isArray((_a = error.meta) === null || _a === void 0 ? void 0 : _a.target) &&
                    ((_b = error.meta) === null || _b === void 0 ? void 0 : _b.target).includes('sku')) {
                    throw new common_1.ConflictException('Bu stok kodu (SKU) zaten mevcut.');
                }
            }
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new Error(`Ürün oluşturulurken bir hata oluştu: ${error.message}`);
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
            await this.productStockService.restoreStockForOldPackageComponents(existingProduct, prisma);
            if (dto.isPackage) {
                await this.productStockService.deductStockForNewPackageComponents(userId, components, dto.quantity, prisma);
            }
            const updatedProduct = await prisma.product.update({
                where: { id: productId },
                data: Object.assign(Object.assign({}, productData), { price: new client_1.Prisma.Decimal(dto.price), packageComponents: {
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
        prisma_service_1.PrismaService,
        product_stock_service_1.ProductStockService])
], ProductsService);
//# sourceMappingURL=products.service.js.map