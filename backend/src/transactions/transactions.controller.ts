import { Controller, Post, Body, Req, UseGuards, Get, Request, Param, Put, Delete, Query } from '@nestjs/common';
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
    async findAll(
        @Req() req,
        @Query('customerId') customerId?: string,
        @Query('field') field?: string,
        @Query('operator') operator?: string,
        @Query('value') value?: string,
        @Query('endValue') endValue?: string,
    ) {
        const userId = req.user.userId;
        return this.transactionsService.getTransactionsByUser(userId, customerId, field, operator, value, endValue);
    }

    @Get(':id')
    async getTransactionById(@Request() req, @Param('id') id: string) {
        const userId = req.user.userId;
        const transaction = await this.transactionsService.getTransactionById(userId, id);
        if (!transaction) {
            return { message: 'Transaction not found or access denied.' };
        }
        return transaction;
    }

    @Get('stats/profit-last-30-days')
    async getProfitLast30Days(@Request() req) {
        const userId = req.user.userId;
        const profit = await this.transactionsService.getProfitLast30Days(userId);
        return { profit };
    }

    @Get('stats/sales-overview')
    async getSalesOverview(@Request() req) {
        const userId = req.user.userId;
        return this.transactionsService.getSalesOverview(userId);
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
