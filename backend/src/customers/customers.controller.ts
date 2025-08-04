import { Controller, Post, Body, UseGuards, Req, Get, Put, Param, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreatePaymentCollectionDto } from './dto/create-payment-collection.dto';

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

  @Get(':id')
  async findOne(@Req() req, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.customersService.findOne(userId, id);
  }

  @Put(':id')
  async update(@Req() req, @Param('id') id: string, @Body() updateCustomerDto: CreateCustomerDto) {
    const userId = req.user.userId;
    return this.customersService.updateCustomer(userId, id, updateCustomerDto);
  }

  @Delete(':id')
  async remove(@Req() req, @Param('id') id: string) {
    const userId = req.user.userId;
    await this.customersService.deleteCustomer(userId, id);
    return { message: 'Customer deleted successfully' };
  }

  @Post('payment-collection')
  async createPaymentCollection(@Req() req, @Body() createPaymentCollectionDto: CreatePaymentCollectionDto) {
    const userId = req.user.userId;
    return this.customersService.createPaymentCollection(userId, createPaymentCollectionDto);
  }
}