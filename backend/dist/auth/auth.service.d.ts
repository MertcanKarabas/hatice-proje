import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<{
        id: string;
        name: string | null;
        email: string;
        emailVerified: Date | null;
        password: string;
        image: string | null;
    }>;
    login(user: any): Promise<{
        access_token: string;
    }>;
    register(data: RegisterDto): Promise<{
        id: string;
        name: string | null;
        email: string;
        emailVerified: Date | null;
        image: string | null;
    }>;
}
