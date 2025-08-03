import { Controller, Post, Body, Req, UseGuards, Get, Request, Param, Put, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    @Post()
    async create(@Req() req, @Body() dto: CreateTransactionDto) {
        const userId = req.user.userId;
        console.log('Creating transaction for user:', userId, 'with data:', dto);
        return this.transactionsService.createTransaction(userId, dto);
    }

    @Get()
    async findAll(@Req() req) {
        const userId = req.user.userId;
        return this.transactionsService.getTransactionsByUser(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getTransactionById(@Request() req, @Param('id') id: string) {
        const userId = req.user.userId;
        const transaction = await this.transactionsService.getTransactionById(userId, id);
        if (!transaction) {
            return { message: 'Transaction not found or access denied.' };
        }
        return transaction;
    }

    @Put(':id')
    async update(@Req() req, @Param('id') id: string, @Body() dto: CreateTransactionDto) {
        const userId = req.user.userId;
        return this.transactionsService.updateTransaction(userId, id, dto);
    }

    @Delete(':id')
    async remove(@Req() req, @Param('id') id: string) {
        const userId = req.user.userId;
        await this.transactionsService.deleteTransaction(userId, id);
        return { message: 'Transaction deleted successfully' };
    }
}
