"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const transactions_controller_1 = require("./transactions.controller");
const transactions_service_1 = require("./transactions.service");
const prisma_service_1 = require("../prisma/prisma.service");
const customer_repository_1 = require("../customers/repositories/customer.repository");
const transaction_repository_1 = require("./repositories/transaction.repository");
const transaction_item_repository_1 = require("./repositories/transaction-item.repository");
const stock_service_1 = require("../stock/stock.service");
const stock_repository_1 = require("../stock/repositories/stock.repository");
const transaction_repository_interface_1 = require("../common/interfaces/transaction.repository.interface");
const transaction_item_repository_interface_1 = require("../common/interfaces/transaction-item.repository.interface");
const stock_repository_interface_1 = require("../common/interfaces/stock.repository.interface");
describe('TransactionsController', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [transactions_controller_1.TransactionsController],
            providers: [
                transactions_service_1.TransactionsService,
                prisma_service_1.PrismaService,
                customer_repository_1.CustomerRepository,
                stock_service_1.StockService,
                {
                    provide: transaction_repository_interface_1.ITransactionRepository,
                    useClass: transaction_repository_1.TransactionRepository,
                },
                {
                    provide: transaction_item_repository_interface_1.ITransactionItemRepository,
                    useClass: transaction_item_repository_1.TransactionItemRepository,
                },
                {
                    provide: stock_repository_interface_1.IStockRepository,
                    useClass: stock_repository_1.StockRepository,
                },
            ],
        }).compile();
        controller = module.get(transactions_controller_1.TransactionsController);
        service = module.get(transactions_service_1.TransactionsService);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=transactions.controller.spec.js.map