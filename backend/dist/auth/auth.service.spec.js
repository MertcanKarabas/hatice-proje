"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("./auth.service");
const user_service_1 = require("../user/user.service");
const jwt_1 = require("@nestjs/jwt");
const user_repository_1 = require("../user/repositories/user.repository");
const user_repository_interface_1 = require("../common/interfaces/user.repository.interface");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
describe('AuthService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            imports: [config_1.ConfigModule.forRoot()],
            providers: [
                auth_service_1.AuthService,
                user_service_1.UserService,
                jwt_1.JwtService,
                prisma_service_1.PrismaService,
                {
                    provide: user_repository_interface_1.IUserRepository,
                    useClass: user_repository_1.UserRepository,
                },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=auth.service.spec.js.map