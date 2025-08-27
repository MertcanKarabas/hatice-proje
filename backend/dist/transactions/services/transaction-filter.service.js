"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionFilterService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let TransactionFilterService = class TransactionFilterService {
    async buildWhereClause(userId, field, operator, value, endValue) {
        const where = { userId };
        console.log('Received field:', field);
        console.log('Received operator:', operator);
        console.log('Received value:', value);
        if (!field) {
            console.log('Filter: field is missing.');
            return where;
        }
        if (!operator) {
            console.log('Filter: operator is missing.');
            return where;
        }
        if (value === undefined || value === '') {
            console.log('Filter: value is undefined or empty.');
            return where;
        }
        const allowedFields = ['customer.commercialTitle', 'type', 'createdAt', 'finalAmount'];
        const allowedOperators = ['contains', 'equals', 'gt', 'lt', 'between'];
        if (!allowedFields.includes(field) || !allowedOperators.includes(operator)) {
            throw new common_1.BadRequestException('Geçersiz filtre');
        }
        if (field === 'customer.commercialTitle') {
            switch (operator) {
                case 'contains':
                    where.customer = { commercialTitle: { contains: value, mode: 'insensitive' } };
                    break;
                case 'equals':
                    where.customer = { commercialTitle: { equals: value } };
                    break;
            }
        }
        else if (field === 'type') {
            if (operator !== 'equals') {
                throw new common_1.BadRequestException("İşlem tipi için sadece 'Eşittir' operatörü kullanılabilir.");
            }
            const validTransactionTypes = Object.values(client_1.TransactionType);
            if (!validTransactionTypes.includes(value)) {
                throw new common_1.BadRequestException('Geçersiz işlem tipi değeri.');
            }
            where.type = value;
        }
        else if (field === 'createdAt') {
            const startDate = new Date(`${value}T00:00:00.000Z`);
            if (isNaN(startDate.getTime())) {
                throw new common_1.BadRequestException('Geçersiz tarih formatı.');
            }
            switch (operator) {
                case 'equals':
                    const endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + 1);
                    where.createdAt = {
                        gte: startDate,
                        lt: endDate
                    };
                    break;
                case 'gt':
                    where.createdAt = { gt: startDate };
                    break;
                case 'lt':
                    where.createdAt = { lt: startDate };
                    break;
                case 'between':
                    if (!endValue) {
                        throw new common_1.BadRequestException('Bitiş tarihi gerekli.');
                    }
                    const endDateValue = new Date(`${endValue}T23:59:59.999Z`);
                    if (isNaN(endDateValue.getTime())) {
                        throw new common_1.BadRequestException('Geçersiz bitiş tarihi formatı.');
                    }
                    where.createdAt = {
                        gte: startDate,
                        lte: endDateValue,
                    };
                    break;
            }
        }
        else if (field === 'finalAmount') {
            const decimalValue = new client_1.Prisma.Decimal(value);
            if (decimalValue.isNaN()) {
                throw new common_1.BadRequestException('Miktar sayısal bir değer olmalıdır.');
            }
            switch (operator) {
                case 'equals':
                    where.finalAmount = decimalValue;
                    break;
                case 'gt':
                    where.finalAmount = { gt: decimalValue };
                    break;
                case 'lt':
                    where.finalAmount = { lt: decimalValue };
                    break;
            }
        }
        console.log('Generated whereClause:', JSON.stringify(where, null, 2));
        return where;
    }
};
exports.TransactionFilterService = TransactionFilterService;
exports.TransactionFilterService = TransactionFilterService = __decorate([
    (0, common_1.Injectable)()
], TransactionFilterService);
//# sourceMappingURL=transaction-filter.service.js.map