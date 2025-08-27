"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerBalanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let CustomerBalanceService = class CustomerBalanceService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async updateCustomerBalance(customerId, finalAmount, transactionType, prismaTransaction) {
        if (!customerId)
            return { previousBalance: new client_1.Prisma.Decimal(0), newBalance: new client_1.Prisma.Decimal(0) };
        const customer = await prismaTransaction.customer.findUnique({ where: { id: customerId } });
        if (customer) {
            const previousBalance = new client_1.Prisma.Decimal(customer.balance);
            let newBalance = new client_1.Prisma.Decimal(customer.balance);
            if (transactionType === client_1.TransactionType.SALE) {
                newBalance = newBalance.plus(finalAmount);
            }
            else if (transactionType === client_1.TransactionType.PURCHASE) {
                newBalance = newBalance.minus(finalAmount);
            }
            else if (transactionType === client_1.TransactionType.COLLECTION) {
                newBalance = newBalance.minus(finalAmount);
            }
            else if (transactionType === client_1.TransactionType.PAYMENT) {
                newBalance = newBalance.plus(finalAmount);
            }
            await prismaTransaction.customer.update({ where: { id: customerId }, data: { balance: newBalance } });
            return { previousBalance, newBalance };
        }
        return { previousBalance: new client_1.Prisma.Decimal(0), newBalance: new client_1.Prisma.Decimal(0) };
    }
    async revertCustomerBalance(customerId, finalAmount, transactionType, prismaTransaction) {
        if (!customerId)
            return;
        const customer = await prismaTransaction.customer.findUnique({ where: { id: customerId } });
        if (customer) {
            let oldBalance = new client_1.Prisma.Decimal(customer.balance);
            if (transactionType === client_1.TransactionType.SALE) {
                oldBalance = oldBalance.minus(finalAmount);
            }
            else if (transactionType === client_1.TransactionType.PURCHASE) {
                oldBalance = oldBalance.plus(finalAmount);
            }
            else if (transactionType === client_1.TransactionType.COLLECTION) {
                oldBalance = oldBalance.plus(finalAmount);
            }
            else if (transactionType === client_1.TransactionType.PAYMENT) {
                oldBalance = oldBalance.minus(finalAmount);
            }
            await prismaTransaction.customer.update({ where: { id: customerId }, data: { balance: oldBalance } });
        }
    }
};
exports.CustomerBalanceService = CustomerBalanceService;
exports.CustomerBalanceService = CustomerBalanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomerBalanceService);
//# sourceMappingURL=customer-balance.service.js.map