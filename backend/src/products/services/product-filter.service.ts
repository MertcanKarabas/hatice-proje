import { Injectable, BadRequestException } from '@nestjs/common';
import { IProductFilterService } from '../interfaces/product-filter.service.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductFilterService implements IProductFilterService {
  async buildWhereClause(userId: string, field?: string, operator?: string, value?: string): Promise<Prisma.ProductWhereInput> {
    const where: Prisma.ProductWhereInput = { userId };

    if (!field || !operator || value === undefined) {
      return where;
    }

    const allowedFields = ['name', 'sku', 'price', 'quantity', 'currency', 'unit'];
    const allowedOperators = ['contains', 'equals', 'gt', 'lt'];

    if (!allowedFields.includes(field) || !allowedOperators.includes(operator)) {
      throw new BadRequestException('Geçersiz filtre');
    }

    function isNumericField(f: string): boolean {
      const numericFields = ['price', 'quantity'];
      return numericFields.includes(f);
    }

    const isNumeric = isNumericField(field);
    if (isNumeric) {
      const numericValue = Number(value);
      if (isNaN(numericValue)) {
        throw new BadRequestException(`${field} sayısal bir değer olmalı`);
      }

      switch (operator) {
        case 'equals':
          where[field] = numericValue;
          break;
        case 'gt':
          where[field] = { gt: numericValue };
          break;
        case 'lt':
          where[field] = { lt: numericValue };
          break;
      }
    } else {
      switch (operator) {
        case 'contains':
          where[field] = { contains: value, mode: 'insensitive' };
          break;
        case 'equals':
          where[field] = value;
          break;
      }
    }

    return where;
  }
}

