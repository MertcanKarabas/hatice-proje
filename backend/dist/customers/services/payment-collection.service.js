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
const transactions_service_1 = require("../../transactions/transactions.service");
let PaymentCollectionService = class PaymentCollectionService {
    constructor(customerRepository, transactionRepository, transactionsService) {
        this.customerRepository = customerRepository;
        this.transactionRepository = transactionRepository;
        this.transactionsService = transactionsService;
    }
    async createPaymentCollection(userId, dto) {
        const customer = await this.customerRepository.findById(dto.customerId);
        if (!customer || customer.userId !== userId) {
            throw new common_1.NotFoundException(`Customer with ID ${dto.customerId} not found or access denied.`);
        }
        const transactionType = dto.type === create_payment_collection_dto_1.PaymentCollectionType.COLLECTION
            ? client_1.TransactionType.COLLECTION
            : client_1.TransactionType.PAYMENT;
        const createTransactionDto = {
            customerId: dto.customerId,
            type: transactionType,
            totalAmount: dto.amount,
            finalAmount: dto.amount,
            discountAmount: 0,
            invoiceDate: dto.date,
            items: [],
        };
        const transaction = await this.transactionsService.createTransaction(userId, createTransactionDto);
        return transaction;
    }
};
exports.PaymentCollectionService = PaymentCollectionService;
exports.PaymentCollectionService = PaymentCollectionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [customer_repository_interface_1.ICustomerRepository,
        transaction_repository_interface_1.ITransactionRepository,
        transactions_service_1.TransactionsService])
], PaymentCollectionService);
//# sourceMappingURL=payment-collection.service.js.map