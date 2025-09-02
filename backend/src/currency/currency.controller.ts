import { Controller, Post, UseGuards, Get } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('currency')
@UseGuards(JwtAuthGuard)
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Post('update-rates')
  async updateRates() {
    await this.currencyService.updateRates();
    return { message: 'Currency rates updated successfully.' };
  }

  @Get()
  async findAll() {
    return this.currencyService.findAll();
  }
}
