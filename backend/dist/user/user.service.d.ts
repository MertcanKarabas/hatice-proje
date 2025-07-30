import { IUserRepository } from 'src/common/interfaces/user.repository.interface';
import { User } from 'generated/prisma';
export declare class UserService {
    private userRepository;
    constructor(userRepository: IUserRepository);
    findByEmail(email: string): Promise<User | null>;
    createUser(data: {
        email: string;
        password: string;
        name: string;
    }): Promise<User>;
    findById(id: string): Promise<User | null>;
}
