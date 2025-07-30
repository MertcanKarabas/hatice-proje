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
exports.StockService = void 0;
const common_1 = require("@nestjs/common");
const stock_repository_interface_1 = require("../common/interfaces/stock.repository.interface");
let StockService = class StockService {
    constructor(stockRepository) {
        this.stockRepository = stockRepository;
    }
    async updateStock(userId, productId, quantity, type) {
        const existingStock = await this.stockRepository.findStockByProductAndUser(userId, productId);
        if (existingStock) {
            const newQuantity = type === 'PURCHASE'
                ? existingStock.quantity + quantity
                : existingStock.quantity - quantity;
            if (newQuantity < 0) {
                throw new common_1.BadRequestException(`Insufficient stock for product ${productId}`);
            }
            return this.stockRepository.updateStockQuantity(existingStock.id, newQuantity);
        }
        else {
            if (type === 'SALE') {
                throw new common_1.BadRequestException(`Stock not found for product ${productId}`);
            }
            return this.stockRepository.createStock(userId, productId, quantity);
        }
    }
};
exports.StockService = StockService;
exports.StockService = StockService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [stock_repository_interface_1.IStockRepository])
], StockService);
//# sourceMappingURL=stock.service.js.map