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
exports.PaymentCollectionService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const customer_repository_interface_1 = require("../../common/interfaces/customer.repository.interface");
const transaction_repository_interface_1 = require("../../common/interfaces/transaction.repository.interface");
const create_payment_collection_dto_1 = require("../dto/create-payment-collection.dto");
let PaymentCollectionService = class PaymentCollectionService {
    constructor(customerRepository, transactionRepository) {
        this.customerRepository = customerRepository;
        this.transactionRepository = transactionRepository;
    }
    async createPaymentCollection(userId, dto) {
        const customer = await this.customerRepository.findById(dto.customerId);
        if (!customer || customer.userId !== userId) {
            throw new common_1.NotFoundException(`Customer with ID ${dto.customerId} not found or access denied.`);
        }
        const amount = new client_1.Prisma.Decimal(dto.amount);
        const transactionType = dto.type === create_payment_collection_dto_1.PaymentCollectionType.COLLECTION
            ? client_1.TransactionType.COLLECTION
            : client_1.TransactionType.PAYMENT;
        const newBalance = dto.type === create_payment_collection_dto_1.PaymentCollectionType.COLLECTION
            ? customer.balance.minus(amount)
            : customer.balance.plus(amount);
        await this.customerRepository.update(customer.id, { balance: newBalance });
        const transaction = await this.transactionRepository.create({
            userId,
            customerId: dto.customerId,
            type: transactionType,
            totalAmount: amount,
            finalAmount: amount,
            discountAmount: new client_1.Prisma.Decimal(0),
        });
        return transaction;
    }
};
exports.PaymentCollectionService = PaymentCollectionService;
exports.PaymentCollectionService = PaymentCollectionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [customer_repository_interface_1.ICustomerRepository,
        transaction_repository_interface_1.ITransactionRepository])
], PaymentCollectionService);
//# sourceMappingURL=payment-collection.service.js.map