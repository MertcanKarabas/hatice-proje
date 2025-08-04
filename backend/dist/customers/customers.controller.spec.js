"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const customers_controller_1 = require("./customers.controller");
const customers_service_1 = require("./customers.service");
const customer_repository_1 = require("./repositories/customer.repository");
const prisma_service_1 = require("../prisma/prisma.service");
const customer_repository_interface_1 = require("../common/interfaces/customer.repository.interface");
describe('CustomersController', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [customers_controller_1.CustomersController],
            providers: [
                customers_service_1.CustomersService,
                prisma_service_1.PrismaService,
                {
                    provide: customer_repository_interface_1.ICustomerRepository,
                    useClass: customer_repository_1.CustomerRepository,
                },
            ],
        }).compile();
        controller = module.get(customers_controller_1.CustomersController);
        service = module.get(customers_service_1.CustomersService);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=customers.controller.spec.js.map