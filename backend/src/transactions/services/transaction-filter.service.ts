import { Injectable, BadRequestException } from '@nestjs/common';
import { ITransactionFilterService } from '../interfaces/transaction-filter.service.interface';
import { Prisma, TransactionType } from '@prisma/client';

@Injectable()
export class TransactionFilterService implements ITransactionFilterService {
  async buildWhereClause(userId: string, field?: string, operator?: string, value?: string, endValue?: string): Promise<Prisma.TransactionWhereInput> {
    const where: Prisma.TransactionWhereInput = { userId };

    console.log('Received field:', field);
    console.log('Received operator:', operator);
    console.log('Received value:', value);

    if (!field) {
      console.log('Filter: field is missing.');
      return where;
    }
    if (!operator) {
      console.log('Filter: operator is missing.');
      return where;
    }
    if (value === undefined || value === '') { // Handle empty string values for filter
      console.log('Filter: value is undefined or empty.');
      return where;
    }

    const allowedFields = ['customer.commercialTitle', 'type', 'createdAt', 'finalAmount'];
    const allowedOperators = ['contains', 'equals', 'gt', 'lt', 'between'];

    if (!allowedFields.includes(field) || !allowedOperators.includes(operator)) {
      throw new BadRequestException('Geçersiz filtre');
    }

    if (field === 'customer.commercialTitle') {
        switch (operator) {
            case 'contains':
                where.customer = { commercialTitle: { contains: value, mode: 'insensitive' } };
                break;
            case 'equals':
                where.customer = { commercialTitle: { equals: value } };
                break;
        }
    } else if (field === 'type') {
        if (operator !== 'equals') {
            throw new BadRequestException("İşlem tipi için sadece 'Eşittir' operatörü kullanılabilir.");
        }
        const validTransactionTypes = Object.values(TransactionType);
        if (!validTransactionTypes.includes(value as TransactionType)) {
            throw new BadRequestException('Geçersiz işlem tipi değeri.');
        }
        where.type = value as TransactionType;
    } else if (field === 'createdAt') {
        // value is expected to be in 'YYYY-MM-DD' format from the frontend
        const startDate = new Date(`${value}T00:00:00.000Z`);
        if (isNaN(startDate.getTime())) {
            throw new BadRequestException('Geçersiz tarih formatı.');
        }

        switch (operator) {
            case 'equals':
                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 1);
                where.createdAt = {
                    gte: startDate,
                    lt: endDate
                };
                break;
            case 'gt':
                where.createdAt = { gt: startDate };
                break;
            case 'lt':
                where.createdAt = { lt: startDate };
                break;
            case 'between':
                if (!endValue) {
                    throw new BadRequestException('Bitiş tarihi gerekli.');
                }
                const endDateValue = new Date(`${endValue}T23:59:59.999Z`);
                if (isNaN(endDateValue.getTime())) {
                    throw new BadRequestException('Geçersiz bitiş tarihi formatı.');
                }
                where.createdAt = {
                    gte: startDate,
                    lte: endDateValue,
                };
                break;
        }
    } else if (field === 'finalAmount') {
        const decimalValue = new Prisma.Decimal(value);
        if (decimalValue.isNaN()) {
            throw new BadRequestException('Miktar sayısal bir değer olmalıdır.');
        }
        switch (operator) {
            case 'equals':
                where.finalAmount = decimalValue;
                break;
            case 'gt':
                where.finalAmount = { gt: decimalValue };
                break;
            case 'lt':
                where.finalAmount = { lt: decimalValue };
                break;
        }
    }
    console.log('Generated whereClause:', JSON.stringify(where, null, 2));
    return where;
  }
}
