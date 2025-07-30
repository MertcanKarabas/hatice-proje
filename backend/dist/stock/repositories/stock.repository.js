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
exports.StockRepository = void 0;
const common_1 = require("@nestjs/common");
const base_repository_1 = require("../../common/database/repositories/base.repository");
const prisma_service_1 = require("../../prisma/prisma.service");
let StockRepository = class StockRepository extends base_repository_1.BaseRepository {
    constructor(prisma) {
        super(prisma, 'stock');
    }
    async findStockByProductAndUser(userId, productId) {
        return this.prisma.stock.findFirst({
            where: {
                userId,
                productId,
            },
        });
    }
    async updateStockQuantity(stockId, newQuantity) {
        return this.prisma.stock.update({
            where: { id: stockId },
            data: { quantity: newQuantity },
        });
    }
    async createStock(userId, productId, quantity) {
        return this.prisma.stock.create({
            data: {
                userId,
                productId,
                quantity,
            },
        });
    }
};
exports.StockRepository = StockRepository;
exports.StockRepository = StockRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StockRepository);
//# sourceMappingURL=stock.repository.js.map