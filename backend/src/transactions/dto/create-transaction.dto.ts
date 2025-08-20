import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransactionItemDto {
  @IsString()
  productId: string;
  
  @IsNumber()
  quantity: number;
  
  @IsNumber()
  price: number;

  @IsString()
  unit: string;

  @IsNumber()
  vatRate: number;
}

export class CreateTransactionDto {
  @IsEnum(['SALE', 'PURCHASE', 'PAYMENT', 'COLLECTION'])
  type: 'SALE' | 'PURCHASE' | 'PAYMENT' | 'COLLECTION';

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsNumber()
  discountAmount?: number;

  @ValidateNested({ each: true })
  @Type(() => CreateTransactionItemDto)
  items: CreateTransactionItemDto[];

  @IsOptional()
  @IsDateString()
  invoiceDate?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsNumber()
  vatRate?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsNumber()
  customerPreviousBalance?: number;

  @IsOptional()
  @IsNumber()
  customerNewBalance?: number;
}