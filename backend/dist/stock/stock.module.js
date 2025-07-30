"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockModule = void 0;
const common_1 = require("@nestjs/common");
const stock_service_1 = require("./stock.service");
const stock_repository_1 = require("./repositories/stock.repository");
const prisma_service_1 = require("../prisma/prisma.service");
const stock_repository_interface_1 = require("../common/interfaces/stock.repository.interface");
let StockModule = class StockModule {
};
exports.StockModule = StockModule;
exports.StockModule = StockModule = __decorate([
    (0, common_1.Module)({
        providers: [
            stock_service_1.StockService,
            prisma_service_1.PrismaService,
            {
                provide: stock_repository_interface_1.IStockRepository,
                useClass: stock_repository_1.StockRepository,
            },
        ],
        exports: [stock_service_1.StockService],
    })
], StockModule);
//# sourceMappingURL=stock.module.js.map