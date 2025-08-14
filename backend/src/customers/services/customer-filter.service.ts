import { Injectable, BadRequestException } from '@nestjs/common';
import { ICustomerFilterService } from '../interfaces/customer-filter.service.interface';
import { Prisma } from 'generated/prisma';

@Injectable()
export class CustomerFilterService implements ICustomerFilterService {
  async buildWhereClause(userId: string, field?: string, operator?: string, value?: string): Promise<Prisma.CustomerWhereInput> {
    const where: Prisma.CustomerWhereInput = { userId };

    if (!field || !operator || value === undefined) {
      return where;
    }

    const allowedFields = ['commercialTitle', 'email', 'phone', 'taxNumber'];
    const allowedOperators = ['contains', 'equals'];

    if (!allowedFields.includes(field) || !allowedOperators.includes(operator)) {
      throw new BadRequestException('Geçersiz filtre');
    }

    switch (operator) {
        case 'contains':
          where[field] = { contains: value, mode: 'insensitive' };
          break;
        case 'equals':
          where[field] = value;
          break;
    }

    return where;
  }
}
