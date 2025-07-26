import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        id: string;
        name: string | null;
        email: string;
        emailVerified: Date | null;
        image: string | null;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
}
