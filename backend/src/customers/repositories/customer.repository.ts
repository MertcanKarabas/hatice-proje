import { Injectable } from '@nestjs/common';
import { Customer } from 'generated/prisma';
import { BaseRepository } from '../../common/database/repositories/base.repository';
import { ICustomerRepository } from '../../common/interfaces/customer.repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CustomerRepository extends BaseRepository<Customer> implements ICustomerRepository {
  constructor(prisma: PrismaService) {
    super(prisma, 'customer');
  }

  async findAllByUser(userId: string): Promise<Customer[]> {
    return this.prisma.customer.findMany({
      where: {
        userId,
      },
      orderBy: {
        commercialTitle: 'asc',
      },
    });
  }
}
