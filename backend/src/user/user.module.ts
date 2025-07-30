import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from './repositories/user.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { IUserRepository } from 'src/common/interfaces/user.repository.interface';

@Module({
  imports: [
    forwardRef(() => AuthModule),
  ],
  providers: [
    UserService,
    PrismaService,
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule { }
