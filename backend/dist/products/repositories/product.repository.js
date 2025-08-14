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
exports.ProductRepository = void 0;
const common_1 = require("@nestjs/common");
const base_repository_1 = require("../../common/database/repositories/base.repository");
const prisma_service_1 = require("../../prisma/prisma.service");
let ProductRepository = class ProductRepository extends base_repository_1.BaseRepository {
    constructor(prisma) {
        super(prisma, 'product');
    }
    async findAllByUser(whereClause) {
        const productsWithStock = await this.prisma.product.findMany({
            where: whereClause,
            include: {
                packageComponents: {
                    include: {
                        component: true,
                    },
                },
                stock: true,
            },
        });
        return productsWithStock.map(product => (Object.assign(Object.assign({}, product), { quantity: product.stock.length > 0 ? product.stock[0].quantity : 0 })));
    }
    async findById(id) {
        const productWithStock = await this.prisma.product.findUnique({
            where: { id },
            include: {
                packageComponents: { include: { component: true } },
                componentOfPackages: { include: { package: true } },
                stock: true,
            }
        });
        if (!productWithStock) {
            return null;
        }
        return Object.assign(Object.assign({}, productWithStock), { quantity: productWithStock.stock.length > 0 ? productWithStock.stock[0].quantity : 0 });
    }
};
exports.ProductRepository = ProductRepository;
exports.ProductRepository = ProductRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductRepository);
//# sourceMappingURL=product.repository.js.map