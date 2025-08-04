"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const testing_1 = require("@nestjs/testing");
const products_service_1 = require("./products.service");
const product_repository_1 = require("./repositories/product.repository");
const product_filter_service_1 = require("./services/product-filter.service");
const prisma_service_1 = require("../prisma/prisma.service");
const product_repository_interface_1 = require("../common/interfaces/product.repository.interface");
const product_filter_service_interface_1 = require("./interfaces/product-filter.service.interface");
describe('ProductsService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
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
        service = module.get(products_service_1.ProductsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=products.service.spec.js.map