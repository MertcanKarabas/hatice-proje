import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';
import { BaseRepository } from '../../common/database/repositories/base.repository';
import { IUserRepository } from '../../common/interfaces/user.repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor(prisma: PrismaService) {
    super(prisma, 'user');
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
