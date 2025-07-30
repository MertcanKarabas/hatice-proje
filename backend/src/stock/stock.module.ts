import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockRepository } from './repositories/stock.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { IStockRepository } from 'src/common/interfaces/stock.repository.interface';

@Module({
  providers: [
    StockService,
    PrismaService,
    {
      provide: IStockRepository,
      useClass: StockRepository,
    },
  ],
  exports: [StockService],
})
export class StockModule {}
