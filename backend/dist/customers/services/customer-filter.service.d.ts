import { ICustomerFilterService } from '../interfaces/customer-filter.service.interface';
import { Prisma } from 'generated/prisma';
export declare class CustomerFilterService implements ICustomerFilterService {
    buildWhereClause(userId: string, field?: string, operator?: string, value?: string): Promise<Prisma.CustomerWhereInput>;
}
