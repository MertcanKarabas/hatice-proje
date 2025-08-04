"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const user_controller_1 = require("./user.controller");
const user_service_1 = require("./user.service");
const user_repository_1 = require("./repositories/user.repository");
const prisma_service_1 = require("../prisma/prisma.service");
const user_repository_interface_1 = require("../common/interfaces/user.repository.interface");
describe('UserController', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [user_controller_1.UserController],
            providers: [
                user_service_1.UserService,
                prisma_service_1.PrismaService,
                {
                    provide: user_repository_interface_1.IUserRepository,
                    useClass: user_repository_1.UserRepository,
                },
            ],
        }).compile();
        controller = module.get(user_controller_1.UserController);
        service = module.get(user_service_1.UserService);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=user.controller.spec.js.map