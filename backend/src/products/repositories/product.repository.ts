import { Injectable } from '@nestjs/common';
import { Product, Prisma } from '@prisma/client';
import { BaseRepository } from '../../common/database/repositories/base.repository';
import { IProductRepository } from '../../common/interfaces/product.repository.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductRepository extends BaseRepository<Product> implements IProductRepository {
  constructor(prisma: PrismaService) {
    super(prisma, 'product');
  }

  async findAllByUser(whereClause: Prisma.ProductWhereInput): Promise<Product[]> {
    const productsWithStock = await this.prisma.product.findMany({
      where: whereClause,
      include: {
        packageComponents: {
          include: {
            component: true,
          },
        },
        stock: true, // Include the stock relation
      },
    });

    // Map the result to include the current stock quantity directly on the product
    return productsWithStock.map(product => ({
      ...product,
      // Assuming there's only one stock entry per product per user due to unique constraint
      // If stock is empty, default to 0
      quantity: product.stock.length > 0 ? product.stock[0].quantity : 0,
    })) as Product[]; // Cast back to Product[]
  }

  async findById(id: string): Promise<Product | null> {
    const productWithStock = await this.prisma.product.findUnique({
      where: { id },
      include: {
        packageComponents: { include: { component: true } },
        componentOfPackages: { include: { package: true } },
        stock: true, // Include the stock relation
      }
    });

    if (!productWithStock) {
      return null;
    }

    // Map the result to include the current stock quantity directly on the product
    return {
      ...productWithStock,
      quantity: productWithStock.stock.length > 0 ? productWithStock.stock[0].quantity : 0,
    } as Product; // Cast back to Product
  }
}