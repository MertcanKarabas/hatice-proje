import { Customer } from 'generated/prisma';
import { IBaseRepository } from './base.repository.interface';
export declare abstract class ICustomerRepository implements IBaseRepository<Customer> {
    abstract findAllByUser(userId: string): Promise<Customer[]>;
    abstract findById(id: string): Promise<Customer | null>;
    abstract findAll(): Promise<Customer[]>;
    abstract create(data: Partial<Customer>): Promise<Customer>;
    abstract update(id: string, data: Partial<Customer>): Promise<Customer>;
    abstract delete(id: string): Promise<void>;
}
