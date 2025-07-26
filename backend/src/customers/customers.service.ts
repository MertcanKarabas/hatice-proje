import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
    constructor(private prisma: PrismaService) { }

    async createCustomer(userId: string, dto: CreateCustomerDto) {
        return this.prisma.customer.create({
            data: {
                userId,
                ...dto,
            },
        });
    }

    async findAllByUser(userId: string) {
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