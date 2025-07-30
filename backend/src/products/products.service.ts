import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Prisma } from 'generated/prisma';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }


  async findAllByUser(userId: string, field: string, operator: string, value: string) {
    console.log("Field:", field)
    console.log("Operator:", operator)
    console.log("Value:", value)
    const where: any = { userId };
    if (!field || !operator || !value)
      return this.prisma.product.findMany({ where });
    const allowedFields = ['name', 'sku', 'price', 'quantity', 'currency', 'unit'];
    const allowedOperators = ['contains', 'equals', 'gt', 'lt'];
    if (!allowedFields.includes(field) || !allowedOperators.includes(operator)) {
      throw new BadRequestException('Geçersiz filtre');
    }
    function isNumericField(field: string): boolean {
      const numericFields = ['price', 'quantity'];
      return numericFields.includes(field);
    }


    if (field && operator && value !== undefined) {
      const isNumeric = isNumericField(field);
      if (isNumeric) {
        const numericValue = Number(value);
        if (isNaN(numericValue)) {
          throw new BadRequestException(`${field} sayısal bir değer olmalı`);
        }

        switch (operator) {
          case 'equals':
            where[field] = numericValue;
            break;
          case 'gt':
            where[field] = { gt: numericValue };
            break;
          case 'lt':
            where[field] = { lt: numericValue };
            break;
        }
      } else {
        switch (operator) {
          case 'contains':
            where[field] = { contains: value, mode: 'insensitive' };
            break;
          case 'equals':
            where[field] = value;
            break;
        }
      }
    }
    console.log("WHERE:", where);
    return this.prisma.product.findMany({ where })

  }
  async createProduct(userId: string, dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        userId,
        name: dto.name,
        description: dto.description,
        sku: dto.sku,
        barcode: dto.barcode,
        price: new Prisma.Decimal(dto.price),
        quantity: dto.quantity,
        unit: dto.unit,
        currency: dto.currency,
      },
    });
  }
  async updateProduct(
    userId: string,
    productId: string,
    dto: CreateProductDto, // DTO olarak UpdateProductDto kullanmak daha doğru olur ama şimdilik bu şekilde devam edelim
  ) {
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
        quantity: dto.quantity,
        unit: dto.unit,
        currency: dto.currency,
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