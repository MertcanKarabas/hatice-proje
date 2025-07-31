import { Injectable, NotFoundException } from '@nestjs/common';
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

    async findOne(userId: string, customerId: string) {
        const customer = await this.customerRepository.findById(customerId);
        if (!customer || customer.userId !== userId) {
            throw new NotFoundException(`Customer with ID ${customerId} not found or access denied.`);
        }
        return customer;
    }

    async updateCustomer(userId: string, customerId: string, dto: CreateCustomerDto) {
        const customer = await this.findOne(userId, customerId);
        return this.customerRepository.update(customer.id, dto);
    }

    async deleteCustomer(userId: string, customerId: string) {
        const customer = await this.findOne(userId, customerId);
        await this.customerRepository.delete(customer.id);
    }
}