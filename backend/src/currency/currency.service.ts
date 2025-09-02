import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { firstValueFrom } from 'rxjs';
import { Prisma } from '@prisma/client';

@Injectable()
export class CurrencyService implements OnModuleInit {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) { }

  async onModuleInit() {
    try {
      await this.updateRates();
      console.log('Currency rates updated on startup.');
    } catch (error) {
      console.error('Failed to update currency rates on startup:', error);
    }
  }

  async updateRates(): Promise<void> {
    const url = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';
    const response = await firstValueFrom(this.httpService.get<any>(url));
    const data = response.data;

    const usdToTryRate = new Prisma.Decimal(data.usd.try);
    const usdToEurRate = new Prisma.Decimal(data.usd.eur);
    const eurToTryRate = usdToTryRate.div(usdToEurRate);

    // Upsert TRY
    await this.prisma.exchange.upsert({
      where: { code: 'TRY' },
      update: { rate: 1 },
      create: { name: 'Turkish Lira', code: 'TRY', rate: 1 },
    });

    // Upsert USD
    await this.prisma.exchange.upsert({
      where: { code: 'USD' },
      update: { rate: usdToTryRate },
      create: { name: 'US Dollar', code: 'USD', rate: usdToTryRate },
    });

    // Upsert EUR
    await this.prisma.exchange.upsert({
      where: { code: 'EUR' },
      update: { rate: eurToTryRate },
      create: { name: 'Euro', code: 'EUR', rate: eurToTryRate },
    });
  }

  async findAll() {
    return this.prisma.exchange.findMany();
  }

  async getRate(currencyCode: string): Promise<Prisma.Decimal> {
    const exchange = await this.prisma.exchange.findUnique({
      where: { code: currencyCode },
    });
    if (!exchange) {
      throw new Error(`Exchange rate for ${currencyCode} not found.`);
    }
    return exchange.rate;
  }

  async convertAmount(
    amount: Prisma.Decimal,
    fromCurrencyCode: string,
    toCurrencyCode: string,
  ): Promise<Prisma.Decimal> {
    if (fromCurrencyCode === toCurrencyCode) {
      return amount;
    }

    const fromRate = await this.getRate(fromCurrencyCode);
    const toRate = await this.getRate(toCurrencyCode);

    // Convert amount to TRY first, then to target currency
    const amountInTry = amount.times(fromRate);
    return amountInTry.div(toRate);
  }
}
