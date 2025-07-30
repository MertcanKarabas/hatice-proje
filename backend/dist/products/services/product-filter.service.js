"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductFilterService = void 0;
const common_1 = require("@nestjs/common");
let ProductFilterService = class ProductFilterService {
    async buildWhereClause(userId, field, operator, value) {
        const where = { userId };
        if (!field || !operator || value === undefined) {
            return where;
        }
        const allowedFields = ['name', 'sku', 'price', 'quantity', 'currency', 'unit'];
        const allowedOperators = ['contains', 'equals', 'gt', 'lt'];
        if (!allowedFields.includes(field) || !allowedOperators.includes(operator)) {
            throw new common_1.BadRequestException('Geçersiz filtre');
        }
        function isNumericField(f) {
            const numericFields = ['price', 'quantity'];
            return numericFields.includes(f);
        }
        const isNumeric = isNumericField(field);
        if (isNumeric) {
            const numericValue = Number(value);
            if (isNaN(numericValue)) {
                throw new common_1.BadRequestException(`${field} sayısal bir değer olmalı`);
            }
            switch (operator) {
                case 'equals':
                    where[field] = numericValue;
                    break;
                case 'gt':
                    where[field] = { gt: numericValue };
                    break;
                case 'lt':
                    where[field] = { lt: numericValue };
                    break;
            }
        }
        else {
            switch (operator) {
                case 'contains':
                    where[field] = { contains: value, mode: 'insensitive' };
                    break;
                case 'equals':
                    where[field] = value;
                    break;
            }
        }
        return where;
    }
};
exports.ProductFilterService = ProductFilterService;
exports.ProductFilterService = ProductFilterService = __decorate([
    (0, common_1.Injectable)()
], ProductFilterService);
//# sourceMappingURL=product-filter.service.js.map