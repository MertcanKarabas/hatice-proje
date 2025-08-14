"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsModule = void 0;
const common_1 = require("@nestjs/common");
const transactions_service_1 = require("./transactions.service");
const transactions_controller_1 = require("./transactions.controller");
const prisma_service_1 = require("../prisma/prisma.service");
const transaction_repository_1 = require("./repositories/transaction.repository");
const transaction_item_repository_1 = require("./repositories/transaction-item.repository");
const stock_module_1 = require("../stock/stock.module");
const transaction_repository_interface_1 = require("../common/interfaces/transaction.repository.interface");
const transaction_item_repository_interface_1 = require("../common/interfaces/transaction-item.repository.interface");
const customer_repository_1 = require("../customers/repositories/customer.repository");
const transaction_filter_service_interface_1 = require("./interfaces/transaction-filter.service.interface");
const transaction_filter_service_1 = require("./services/transaction-filter.service");
let TransactionsModule = class TransactionsModule {
};
exports.TransactionsModule = TransactionsModule;
exports.TransactionsModule = TransactionsModule = __decorate([
    (0, common_1.Module)({
        imports: [stock_module_1.StockModule],
        providers: [
            transactions_service_1.TransactionsService,
            prisma_service_1.PrismaService,
            {
                provide: transaction_repository_interface_1.ITransactionRepository,
                useClass: transaction_repository_1.TransactionRepository,
            },
            {
                provide: transaction_item_repository_interface_1.ITransactionItemRepository,
                useClass: transaction_item_repository_1.TransactionItemRepository,
            },
            customer_repository_1.CustomerRepository,
            {
                provide: transaction_filter_service_interface_1.ITransactionFilterService,
                useClass: transaction_filter_service_1.TransactionFilterService,
            },
        ],
        controllers: [transactions_controller_1.TransactionsController]
    })
], TransactionsModule);
//# sourceMappingURL=transactions.module.js.map