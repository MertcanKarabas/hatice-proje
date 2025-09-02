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
exports.CurrencyService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const prisma_service_1 = require("../prisma/prisma.service");
const rxjs_1 = require("rxjs");
const client_1 = require("@prisma/client");
let CurrencyService = class CurrencyService {
    constructor(httpService, prisma) {
        this.httpService = httpService;
        this.prisma = prisma;
    }
    async onModuleInit() {
        try {
            await this.updateRates();
            console.log('Currency rates updated on startup.');
        }
        catch (error) {
            console.error('Failed to update currency rates on startup:', error);
        }
    }
    async updateRates() {
        const url = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';
        const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url));
        const data = response.data;
        const usdToTryRate = new client_1.Prisma.Decimal(data.usd.try);
        const usdToEurRate = new client_1.Prisma.Decimal(data.usd.eur);
        const eurToTryRate = usdToTryRate.div(usdToEurRate);
        await this.prisma.exchange.upsert({
            where: { code: 'TRY' },
            update: { rate: 1 },
            create: { name: 'Turkish Lira', code: 'TRY', rate: 1 },
        });
        await this.prisma.exchange.upsert({
            where: { code: 'USD' },
            update: { rate: usdToTryRate },
            create: { name: 'US Dollar', code: 'USD', rate: usdToTryRate },
        });
        await this.prisma.exchange.upsert({
            where: { code: 'EUR' },
            update: { rate: eurToTryRate },
            create: { name: 'Euro', code: 'EUR', rate: eurToTryRate },
        });
    }
    async findAll() {
        return this.prisma.exchange.findMany();
    }
    async getRate(currencyCode) {
        const exchange = await this.prisma.exchange.findUnique({
            where: { code: currencyCode },
        });
        if (!exchange) {
            throw new Error(`Exchange rate for ${currencyCode} not found.`);
        }
        return exchange.rate;
    }
    async convertAmount(amount, fromCurrencyCode, toCurrencyCode) {
        if (fromCurrencyCode === toCurrencyCode) {
            return amount;
        }
        const fromRate = await this.getRate(fromCurrencyCode);
        const toRate = await this.getRate(toCurrencyCode);
        const amountInTry = amount.times(fromRate);
        return amountInTry.div(toRate);
    }
};
exports.CurrencyService = CurrencyService;
exports.CurrencyService = CurrencyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        prisma_service_1.PrismaService])
], CurrencyService);
//# sourceMappingURL=currency.service.js.map