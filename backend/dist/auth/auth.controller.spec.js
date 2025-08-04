"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const user_service_1 = require("../user/user.service");
const jwt_1 = require("@nestjs/jwt");
const user_repository_1 = require("../user/repositories/user.repository");
const prisma_service_1 = require("../prisma/prisma.service");
const user_repository_interface_1 = require("../common/interfaces/user.repository.interface");
const config_1 = require("@nestjs/config");
describe('AuthController', () => {
    let controller;
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [auth_controller_1.AuthController],
            providers: [
                auth_service_1.AuthService,
                user_service_1.UserService,
                jwt_1.JwtService,
                prisma_service_1.PrismaService,
                config_1.ConfigService,
                {
                    provide: user_repository_interface_1.IUserRepository,
                    useClass: user_repository_1.UserRepository,
                },
            ],
        }).compile();
        controller = module.get(auth_controller_1.AuthController);
        service = module.get(auth_service_1.AuthService);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=auth.controller.spec.js.map