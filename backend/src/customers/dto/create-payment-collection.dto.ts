import { IsString, IsNumber, IsNotEmpty, IsOptional, IsDateString, IsIn } from 'class-validator';

export enum PaymentCollectionType {
  COLLECTION = 'COLLECTION',
  PAYMENT = 'PAYMENT',
}

export class CreatePaymentCollectionDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  @IsIn([PaymentCollectionType.COLLECTION, PaymentCollectionType.PAYMENT])
  type: PaymentCollectionType;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  exchangeId?: string;
}
