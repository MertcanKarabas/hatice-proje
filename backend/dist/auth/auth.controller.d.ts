import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        name: string | null;
        id: string;
        email: string;
        emailVerified: Date | null;
        password: string;
        image: string | null;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
}
