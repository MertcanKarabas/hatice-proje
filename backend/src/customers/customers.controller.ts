import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(@Req() req, @Body() createCustomerDto: CreateCustomerDto) {
    const userId = req.user.userId;
    return this.customersService.createCustomer(userId, createCustomerDto);
  }

  @Get()
  async findAll(@Req() req) {
    const userId = req.user.userId;
    return this.customersService.findAllByUser(userId);
  }
}