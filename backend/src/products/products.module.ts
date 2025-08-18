import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductRepository } from './repositories/product.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductFilterService } from './services/product-filter.service';
import { IProductRepository } from 'src/common/interfaces/product.repository.interface';
import { IProductFilterService } from './interfaces/product-filter.service.interface';
import { ProductStockService } from './services/product-stock.service';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    PrismaService,
    ProductStockService,
    {
      provide: IProductRepository,
      useClass: ProductRepository,
    },
    {
      provide: IProductFilterService,
      useClass: ProductFilterService,
    },
  ]
})
export class ProductsModule {}