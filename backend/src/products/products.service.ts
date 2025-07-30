import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Prisma } from 'generated/prisma';
import { IProductRepository } from 'src/common/interfaces/product.repository.interface';
import { IProductFilterService } from './interfaces/product-filter.service.interface';

@Injectable()
export class ProductsService {
  constructor(
    private productRepository: IProductRepository,
    private productFilterService: IProductFilterService,
  ) { }

  async findAllByUser(userId: string, field: string, operator: string, value: string) {
    const whereClause = await this.productFilterService.buildWhereClause(userId, field, operator, value);
    return this.productRepository.findAllByUser(whereClause);
  }

  async createProduct(userId: string, dto: CreateProductDto) {
    return this.productRepository.create({
      userId,
      name: dto.name,
      description: dto.description,
      sku: dto.sku,
      barcode: dto.barcode,
      price: new Prisma.Decimal(dto.price),
      quantity: dto.quantity,
      unit: dto.unit,
      currency: dto.currency,
    });
  }

  async updateProduct(
    userId: string,
    productId: string,
    dto: CreateProductDto,
  ) {
    const existingProduct = await this.productRepository.findById(productId);
    if (!existingProduct || existingProduct.userId !== userId) {
      throw new NotFoundException(`Product with ID ${productId} not found or access denied.`);
    }
    return this.productRepository.update(productId, {
      name: dto.name,
      description: dto.description,
      sku: dto.sku,
      barcode: dto.barcode,
      price: new Prisma.Decimal(dto.price),
      quantity: dto.quantity,
      unit: dto.unit,
      currency: dto.currency,
    });
  }

  async deleteProduct(userId: string, productId: string) {
    const existingProduct = await this.productRepository.findById(productId);
    if (!existingProduct || existingProduct.userId !== userId) {
      throw new NotFoundException(`Product with ID ${productId} not found or access denied.`);
    }
    return this.productRepository.delete(productId);
  }
}