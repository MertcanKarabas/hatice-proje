import { OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class CurrencyService implements OnModuleInit {
    private readonly httpService;
    private readonly prisma;
    constructor(httpService: HttpService, prisma: PrismaService);
    onModuleInit(): Promise<void>;
    updateRates(): Promise<void>;
    findAll(): Promise<{
        id: string;
        name: string;
        code: string;
        rate: Prisma.Decimal;
    }[]>;
    getRate(currencyCode: string): Promise<Prisma.Decimal>;
    convertAmount(amount: Prisma.Decimal, fromCurrencyCode: string, toCurrencyCode: string): Promise<Prisma.Decimal>;
}
