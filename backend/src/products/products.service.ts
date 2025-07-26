import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Prisma } from 'generated/prisma';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  async findAllByUser(userId: string) {
    return this.prisma.product.findMany({
      where: {
        userId,
      },
    });
  }
  async createProduct(userId: string, dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        userId,
        name: dto.name,
        description: dto.description,
        sku: dto.sku,
        barcode: dto.barcode,
        price: dto.price,
      },
    });
  }
  async updateProduct(userId: string, productId: string, dto: CreateProductDto) {
    return this.prisma.product.updateMany({
      where: {
        id: productId,
        userId,
      },
      data: {
        name: dto.name,
        description: dto.description,
        sku: dto.sku,
        barcode: dto.barcode,
        price: new Prisma.Decimal(dto.price),
      },
    });
  }

  async deleteProduct(userId: string, productId: string) {
    return this.prisma.product.deleteMany({
      where: {
        id: productId,
        userId,
      },
    });
  }
}