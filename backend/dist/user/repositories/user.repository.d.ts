import { User } from '@prisma/client';
import { BaseRepository } from '../../common/database/repositories/base.repository';
import { IUserRepository } from '../../common/interfaces/user.repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class UserRepository extends BaseRepository<User> implements IUserRepository {
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<User | null>;
}
