"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersModule = void 0;
const common_1 = require("@nestjs/common");
const customers_service_1 = require("./customers.service");
const customers_controller_1 = require("./customers.controller");
const customer_repository_1 = require("./repositories/customer.repository");
const prisma_service_1 = require("../prisma/prisma.service");
const customer_repository_interface_1 = require("../common/interfaces/customer.repository.interface");
const transaction_repository_interface_1 = require("../common/interfaces/transaction.repository.interface");
const transaction_repository_1 = require("../transactions/repositories/transaction.repository");
const customer_filter_service_interface_1 = require("./interfaces/customer-filter.service.interface");
const customer_filter_service_1 = require("./services/customer-filter.service");
const payment_collection_service_1 = require("./services/payment-collection.service");
let CustomersModule = class CustomersModule {
};
exports.CustomersModule = CustomersModule;
exports.CustomersModule = CustomersModule = __decorate([
    (0, common_1.Module)({
        providers: [
            customers_service_1.CustomersService,
            prisma_service_1.PrismaService,
            {
                provide: customer_repository_interface_1.ICustomerRepository,
                useClass: customer_repository_1.CustomerRepository,
            },
            {
                provide: transaction_repository_interface_1.ITransactionRepository,
                useClass: transaction_repository_1.TransactionRepository,
            },
            {
                provide: customer_filter_service_interface_1.ICustomerFilterService,
                useClass: customer_filter_service_1.CustomerFilterService,
            },
            payment_collection_service_1.PaymentCollectionService,
        ],
        controllers: [customers_controller_1.CustomersController],
        exports: [customers_service_1.CustomersService],
    })
], CustomersModule);
//# sourceMappingURL=customers.module.js.map