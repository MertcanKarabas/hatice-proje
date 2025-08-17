import { OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class CurrencyService implements OnModuleInit {
    private readonly httpService;
    private readonly prisma;
    constructor(httpService: HttpService, prisma: PrismaService);
    onModuleInit(): Promise<void>;
    updateRates(): Promise<void>;
}
