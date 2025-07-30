import { User } from 'generated/prisma';
import { IBaseRepository } from './base.repository.interface';
export declare abstract class IUserRepository implements IBaseRepository<User> {
    abstract findByEmail(email: string): Promise<User | null>;
    abstract findById(id: string): Promise<User | null>;
    abstract findAll(): Promise<User[]>;
    abstract create(data: Partial<User>): Promise<User>;
    abstract update(id: string, data: Partial<User>): Promise<User>;
    abstract delete(id: string): Promise<void>;
}
