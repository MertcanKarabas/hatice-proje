import { Customer, Prisma } from 'generated/prisma';
import { BaseRepository } from '../../common/database/repositories/base.repository';
import { ICustomerRepository } from '../../common/interfaces/customer.repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class CustomerRepository extends BaseRepository<Customer> implements ICustomerRepository {
    constructor(prisma: PrismaService);
    findAllByUser(whereClause: Prisma.CustomerWhereInput): Promise<Customer[]>;
}
