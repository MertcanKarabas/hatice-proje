import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class TransactionsService {
    constructor(private readonly prisma: PrismaService) { }

    async createTransaction(
        userId: string,
        dto: CreateTransactionDto,
    ) {
        const { type, discountAmount = 0, items } = dto;

        // Toplam ve net tutar hesaplama
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const finalAmount = totalAmount - discountAmount;

        return this.prisma.$transaction(async (tx) => {
            // Transaction oluştur
            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    type,
                    totalAmount,
                    discountAmount,
                    finalAmount,
                },
            });

            // Item'ları oluştur
            await tx.transactionItem.createMany({
                data: items.map((item) => ({
                    transactionId: transaction.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                })),
            });

            // Stokları güncelle
            for (const item of items) {
                const existingStock = await tx.stock.findFirst({
                    where: {
                        userId,
                        productId: item.productId,
                    },
                });

                if (existingStock) {
                    await tx.stock.update({
                        where: { id: existingStock.id },
                        data: {
                            quantity:
                                type === 'PURCHASE'
                                    ? existingStock.quantity + item.quantity
                                    : existingStock.quantity - item.quantity,
                        },
                    });
                } else {
                    // Stok yoksa ve bu bir alış ise oluştur, satış ise hata
                    if (type === 'SALE' && !existingStock) {
                        throw new BadRequestException(`Stok bulunamadı: ${item.productId}`);
                    }

                    await tx.stock.create({
                        data: {
                            userId,
                            productId: item.productId,
                            quantity: item.quantity,
                        },
                    });
                }
            }

            return transaction;
        });
    }
    async getTransactionsByUser(userId: string) {
        return this.prisma.transaction.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                payments: true,
                discounts: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async getTransactionById(userId: string, transactionId: string) {
        return this.prisma.transaction.findFirst({
            where: {
                id: transactionId,
                userId,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                payments: true,
                discounts: true,
            },
        });
    }
}
