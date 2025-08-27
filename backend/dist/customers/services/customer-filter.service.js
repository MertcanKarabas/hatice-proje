"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerFilterService = void 0;
const common_1 = require("@nestjs/common");
let CustomerFilterService = class CustomerFilterService {
    async buildWhereClause(userId, field, operator, value) {
        const where = { userId };
        if (!field || !operator || value === undefined) {
            return where;
        }
        const allowedFields = ['commercialTitle', 'email', 'phone', 'taxNumber', 'type'];
        const enumFields = ['type'];
        if (!allowedFields.includes(field)) {
            throw new common_1.BadRequestException('Geçersiz filtre alanı');
        }
        if (enumFields.includes(field)) {
            if (operator !== 'equals') {
                throw new common_1.BadRequestException(`Operatör '${operator}' enum alanı '${field}' için geçersizdir. Sadece 'equals' desteklenir.`);
            }
            if (value === '') {
                return where;
            }
            where[field] = value;
        }
        else {
            const allowedStringOperators = ['contains', 'equals'];
            if (!allowedStringOperators.includes(operator)) {
                throw new common_1.BadRequestException(`Operatör '${operator}' string alanı '${field}' için geçersizdir.`);
            }
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
exports.CustomerFilterService = CustomerFilterService;
exports.CustomerFilterService = CustomerFilterService = __decorate([
    (0, common_1.Injectable)()
], CustomerFilterService);
//# sourceMappingURL=customer-filter.service.js.map