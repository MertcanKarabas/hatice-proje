import { CurrencyService } from './currency.service';
export declare class CurrencyController {
    private readonly currencyService;
    constructor(currencyService: CurrencyService);
    updateRates(): Promise<{
        message: string;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        code: string;
        rate: import("@prisma/client/runtime/library").Decimal;
    }[]>;
}
