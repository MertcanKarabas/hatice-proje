import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products') // Bu controller'daki tüm endpoint'ler /products ile başlar

export class ProductsController {
  constructor(private readonly productService: ProductsService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyProducts(@Request() req) {
    const userId = req.user.userId;
    const products = await this.productService.findAllByUser(userId);
    return { message: 'Success', data: products };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createProductDto: CreateProductDto) {
    const userId = req.user.userId; // JWT'den gelen userId
    const product = await this.productService.createProduct(userId, createProductDto);
    return {
      message: 'Product created successfully',
      data: product,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateProductDto: CreateProductDto, // veya UpdateProductDto
  ) {
    const userId = req.user.userId;
    const updatedProduct = await this.productService.updateProduct(userId, id, updateProductDto);
    return {
      message: 'Product updated successfully',
      data: updatedProduct,
    };
  }


  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const userId = req.user.userId;
    await this.productService.deleteProduct(userId, id);
    return {
      message: 'Product deleted successfully',
    };
  }
  
}
