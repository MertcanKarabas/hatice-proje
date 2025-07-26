import { Controller, Post, Body, Req, UseGuards, Get, Request, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    @Post()
    async create(@Req() req, @Body() dto: CreateTransactionDto) {
        const userId = req.user.id;
        return this.transactionsService.createTransaction(userId, dto);
    }

    @Get()
    async findAll(@Req() req) {
        const userId = req.user.id;
        return this.transactionsService.getTransactionsByUser(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getTransactionById(@Request() req, @Param('id') id: string) {
        const userId = req.user.id;
        const transaction = await this.transactionsService.getTransactionById(userId, id);
        if (!transaction) {
            return { message: 'Transaction not found or access denied.' };
        }
        return transaction;
    }
}
