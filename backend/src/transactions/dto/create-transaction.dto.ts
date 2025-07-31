import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
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
  @IsEnum(['SALE', 'PURCHASE'])
  type: 'SALE' | 'PURCHASE';

  @IsOptional()
  @IsNumber()
  discountAmount?: number;

  @ValidateNested({ each: true })
  @Type(() => CreateTransactionItemDto)
  items: CreateTransactionItemDto[];
}
