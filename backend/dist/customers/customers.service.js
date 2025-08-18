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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const customer_repository_interface_1 = require("../common/interfaces/customer.repository.interface");
const transaction_repository_interface_1 = require("../common/interfaces/transaction.repository.interface");
const customer_filter_service_interface_1 = require("./interfaces/customer-filter.service.interface");
const payment_collection_service_1 = require("./services/payment-collection.service");
let CustomersService = class CustomersService {
    constructor(customerRepository, transactionRepository, customerFilterService, paymentCollectionService) {
        this.customerRepository = customerRepository;
        this.transactionRepository = transactionRepository;
        this.customerFilterService = customerFilterService;
        this.paymentCollectionService = paymentCollectionService;
    }
    async createCustomer(userId, dto) {
        return this.customerRepository.create(Object.assign({ userId }, dto));
    }
    async findAllByUser(userId, field, operator, value) {
        const whereClause = await this.customerFilterService.buildWhereClause(userId, field, operator, value);
        return this.customerRepository.findAllByUser(whereClause);
    }
    async findOne(userId, customerId) {
        const customer = await this.customerRepository.findById(customerId);
        if (!customer || customer.userId !== userId) {
            throw new common_1.NotFoundException(`Customer with ID ${customerId} not found or access denied.`);
        }
        return customer;
    }
    async updateCustomer(userId, customerId, dto) {
        const customer = await this.findOne(userId, customerId);
        return this.customerRepository.update(customer.id, dto);
    }
    async deleteCustomer(userId, customerId) {
        const customer = await this.findOne(userId, customerId);
        await this.customerRepository.delete(customer.id);
    }
    async getTransactions(userId, customerId) {
        await this.findOne(userId, customerId);
        return this.transactionRepository.getTransactionsByCustomer(customerId);
    }
    async createPaymentCollection(userId, dto) {
        return this.paymentCollectionService.createPaymentCollection(userId, dto);
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [customer_repository_interface_1.ICustomerRepository,
        transaction_repository_interface_1.ITransactionRepository,
        customer_filter_service_interface_1.ICustomerFilterService,
        payment_collection_service_1.PaymentCollectionService])
], CustomersService);
//# sourceMappingURL=customers.service.js.map