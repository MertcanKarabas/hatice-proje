import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) return null;

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) return null;

        return user;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }


    async register(data: RegisterDto) {
        // Önce kullanıcı var mı kontrol et
        const existingUser = await this.userService.findByEmail(data.email);
        if (existingUser) {
            throw new ConflictException('Email already in use');
        }
        // Şifreyi hash'le
        const hashedPassword = await bcrypt.hash(data.password, 10);
        // Yeni kullanıcı oluştur
        const newUser = await this.userService.createUser({
            email: data.email,
            name: data.name,
            password: hashedPassword
        });
        const { password, ...userWithoutPassword } = newUser;
        // İstersen parola hariç dönebilirsin
        return userWithoutPassword;
    }

}
