import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/common/interfaces/user.repository.interface';
import { User } from 'generated/prisma';

@Injectable()
export class UserService {
    constructor(private userRepository: IUserRepository) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findByEmail(email);
    }

    async createUser(data: { email: string; password: string, name: string }): Promise<User> {
        return this.userRepository.create(data);
    }

    async findById(id: string): Promise<User | null> {
        return this.userRepository.findById(id);
    }
}
