import { Injectable, BadRequestException } from '@nestjs/common';
import { ICustomerFilterService } from '../interfaces/customer-filter.service.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomerFilterService implements ICustomerFilterService {
  async buildWhereClause(userId: string, field?: string, operator?: string, value?: string): Promise<Prisma.CustomerWhereInput> {
    const where: Prisma.CustomerWhereInput = { userId };

    if (!field || !operator || value === undefined) {
      return where;
    }

    const allowedFields = ['commercialTitle', 'email', 'phone', 'taxNumber', 'type'];
    const enumFields = ['type'];

    if (!allowedFields.includes(field)) {
      throw new BadRequestException('Geçersiz filtre alanı');
    }

    if (enumFields.includes(field)) {
      if (operator !== 'equals') {
        throw new BadRequestException(`Operatör '${operator}' enum alanı '${field}' için geçersizdir. Sadece 'equals' desteklenir.`);
      }
      if (value === '') { // If value is empty for an enum, don't apply the filter
        return where;
      }
      where[field] = value;
    } else {
      const allowedStringOperators = ['contains', 'equals'];
      if (!allowedStringOperators.includes(operator)) {
        throw new BadRequestException(`Operatör '${operator}' string alanı '${field}' için geçersizdir.`);
      }
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
