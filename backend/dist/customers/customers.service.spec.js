"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const customers_service_1 = require("./customers.service");
const customer_repository_1 = require("./repositories/customer.repository");
const prisma_service_1 = require("../prisma/prisma.service");
const customer_repository_interface_1 = require("../common/interfaces/customer.repository.interface");
describe('CustomersService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [customers_service_1.CustomersService, customer_repository_1.CustomerRepository, prisma_service_1.PrismaService, {
                    provide: customer_repository_interface_1.ICustomerRepository,
                    useClass: customer_repository_1.CustomerRepository,
                }],
        }).compile();
        service = module.get(customers_service_1.CustomersService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=customers.service.spec.js.map