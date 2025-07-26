"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const customer_controller_1 = require("./customer.controller");
describe('CustomerController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [customer_controller_1.CustomerController],
        }).compile();
        controller = module.get(customer_controller_1.CustomerController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=customer.controller.spec.js.map