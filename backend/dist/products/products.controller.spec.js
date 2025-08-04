"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const products_controller_1 = require("./products.controller");
const products_service_1 = require("./products.service");
const product_repository_1 = require("./repositories/product.repository");
const product_filter_service_1 = require("./services/product-filter.service");
const prisma_service_1 = require("../prisma/prisma.service");
const product_repository_interface_1 = require("../common/interfaces/product.repository.interface");
const product_filter_service_interface_1 = require("./interfaces/product-filter.service.interface");
describe('ProductsController', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [products_controller_1.ProductsController],
            providers: [
                products_service_1.ProductsService,
                prisma_service_1.PrismaService,
                {
                    provide: product_repository_interface_1.IProductRepository,
                    useClass: product_repository_1.ProductRepository,
                },
                {
                    provide: product_filter_service_interface_1.IProductFilterService,
                    useClass: product_filter_service_1.ProductFilterService,
                },
            ],
        }).compile();
        controller = module.get(products_controller_1.ProductsController);
        service = module.get(products_service_1.ProductsService);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=products.controller.spec.js.map