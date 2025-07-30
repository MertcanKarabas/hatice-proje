import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.modue';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TransactionsModule } from './transactions/transactions.module';
import { CustomersController } from './customers/customers.controller';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [ProductsModule, AuthModule, UserModule, PrismaModule, TransactionsModule, ConfigModule.forRoot({
    isGlobal: true,
  }), ThrottlerModule.forRoot({
    throttlers: [{
      ttl: 60,
      limit: 10
    }]
  }), TransactionsModule, CustomersModule],
  controllers: [AppController, CustomersController],
  providers: [AppService],
})
export class AppModule { }
