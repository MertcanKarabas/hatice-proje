import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Request() req) {
        return {
            message: 'Success',
            user: req.user, // JwtStrategy içindeki return
        };
    }
}
