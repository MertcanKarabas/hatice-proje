import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        try {
            return await this.authService.register(registerDto);
        } catch (error) {
            if (error.status === 409) {
                throw new BadRequestException('Email already registered');
            }
            throw error;
        }
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(
            loginDto.email,
            loginDto.password,
        );
        console.log("User:", user)
        if (!user) {
            throw new BadRequestException('Invalid email or password');
        }
        return this.authService.login(user);
    }
}
