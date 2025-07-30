import { JwtService } from '@nestjs/jwt';
import { User } from 'generated/prisma';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<{
        name: string | null;
        id: string;
        email: string;
        emailVerified: Date | null;
        password: string;
        image: string | null;
    }>;
    login(user: User): Promise<{
        access_token: string;
    }>;
    register(data: RegisterDto): Promise<{
        name: string | null;
        id: string;
        email: string;
        emailVerified: Date | null;
        password: string;
        image: string | null;
    }>;
}
