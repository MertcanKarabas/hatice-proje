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
exports.ProfitCalculationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const prisma_1 = require("../../../generated/prisma/index.js");
let ProfitCalculationService = class ProfitCalculationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async calculateProfit(items, prismaTransaction) {
        let profit = new prisma_1.Prisma.Decimal(0);
        for (const item of items) {
            const product = await prismaTransaction.product.findUnique({ where: { id: item.productId } });
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID ${item.productId} not found.`);
            }
            const itemProfit = new prisma_1.Prisma.Decimal(item.price).minus(product.price).times(item.quantity);
            if (product.currency === 'TRY') {
                profit = profit.plus(itemProfit);
            }
            else {
                const exchangeRate = await prismaTransaction.exchange.findUnique({ where: { code: product.currency } });
                if (!exchangeRate) {
                    throw new common_1.NotFoundException(`Exchange rate for ${product.currency} not found.`);
                }
                profit = profit.plus(itemProfit.times(exchangeRate.rate));
            }
        }
        return profit;
    }
};
exports.ProfitCalculationService = ProfitCalculationService;
exports.ProfitCalculationService = ProfitCalculationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProfitCalculationService);
//# sourceMappingURL=profit-calculation.service.js.map