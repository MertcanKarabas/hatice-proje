import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { ICustomerRepository } from 'src/common/interfaces/customer.repository.interface';

@Injectable()
export class CustomersService {
    constructor(private customerRepository: ICustomerRepository) { }

    async createCustomer(userId: string, dto: CreateCustomerDto) {
        return this.customerRepository.create({
            userId,
            ...dto,
        });
    }

    async findAllByUser(userId: string) {
        return this.customerRepository.findAllByUser(userId);
    }
}