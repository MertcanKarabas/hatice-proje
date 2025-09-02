import { Customer, Prisma } from '@prisma/client';
import { BaseRepository } from '../../common/database/repositories/base.repository';
import { ICustomerRepository } from '../../common/interfaces/customer.repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class CustomerRepository extends BaseRepository<Customer> implements ICustomerRepository {
    constructor(prisma: PrismaService);
    findById(id: string): Promise<Customer | null>;
    findAllByUser(whereClause: Prisma.CustomerWhereInput): Promise<Customer[]>;
}
