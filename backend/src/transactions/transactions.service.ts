import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ITransactionRepository } from 'src/common/interfaces/transaction.repository.interface';
import { ITransactionItemRepository } from 'src/common/interfaces/transaction-item.repository.interface';
import { StockService } from 'src/stock/stock.service';
import { Prisma, CustomerType, TransactionType } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerRepository } from 'src/customers/repositories/customer.repository';
import { ITransactionFilterService } from './interfaces/transaction-filter.service.interface';

@Injectable()
export class TransactionsService {
    constructor(
        private readonly transactionRepository: ITransactionRepository,
        private readonly transactionItemRepository: ITransactionItemRepository,
        private readonly stockService: StockService,
        private readonly prisma: PrismaService,
        private readonly customerRepository: CustomerRepository,
        private readonly transactionFilterService: ITransactionFilterService,
    ) { }

    async createTransaction(
        userId: string,
        dto: CreateTransactionDto,
    ) {
        return this.prisma.$transaction(async (prisma) => {
            const { type, discountAmount = 0, items, customerId, invoiceDate, dueDate, vatRate, currency } = dto;

            if (type === 'SALE') {
                for (const item of items) {
                    const stock = await prisma.stock.findFirst({ where: { productId: item.productId, userId } });
                    if (!stock || stock.quantity < item.quantity) {
                        const product = await prisma.product.findUnique({ where: { id: item.productId } });
                        throw new BadRequestException(`Yetersiz stok: ${product?.name ?? item.productId}`);
                    }
                }
            }

            const totalAmount = new Prisma.Decimal(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
            const finalAmount = new Prisma.Decimal(totalAmount.minus(discountAmount));

            let profit = new Prisma.Decimal(0);
            if (type === 'SALE') {
                for (const item of items) {
                    const product = await prisma.product.findUnique({ where: { id: item.productId } });
                    if (!product) {
                        throw new NotFoundException(`Product with ID ${item.productId} not found.`);
                    }
                    const itemProfit = new Prisma.Decimal(item.price).minus(product.price).times(item.quantity);

                    if (product.currency === 'TRY') {
                        profit = profit.plus(itemProfit);
                    } else {
                        const exchangeRate = await prisma.exchange.findUnique({ where: { code: product.currency } });
                        if (!exchangeRate) {
                            throw new NotFoundException(`Exchange rate for ${product.currency} not found.`);
                        }
                        profit = profit.plus(itemProfit.times(exchangeRate.rate));
                    }
                }
            }

            const transaction = await prisma.transaction.create({
                data: {
                    userId,
                    type,
                    customerId,
                    totalAmount,
                    discountAmount: new Prisma.Decimal(discountAmount),
                    finalAmount,
                    profit: type === 'SALE' ? profit : null,
                    invoiceDate: invoiceDate ? new Date(invoiceDate) : null,
                    dueDate: dueDate ? new Date(dueDate) : null,
                    vatRate,
                    currency,
                },
            });

            if (items && items.length > 0) {
                await prisma.transactionItem.createMany({
                    data: items.map((item) => ({
                        transactionId: transaction.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                        unit: item.unit,
                        vatRate: item.vatRate,
                    })),
                });

                if (type === 'SALE' || type === 'PURCHASE') {
                    for (const item of items) {
                        await this.stockService.updateStock(userId, item.productId, item.quantity, type);
                    }
                }

                if (type === 'PURCHASE') {
                    for (const item of items) {
                        await prisma.product.update({
                            where: { id: item.productId },
                            data: { price: item.price },
                        });
                    }
                }
            }

            if (customerId) {
                const customer = await prisma.customer.findUnique({ where: { id: customerId } });
                if (customer) {
                    let newBalance = new Prisma.Decimal(customer.balance);
                    if (transaction.type === TransactionType.SALE) {
                        newBalance = newBalance.plus(finalAmount);
                    } else if (transaction.type === TransactionType.PURCHASE) {
                        newBalance = newBalance.minus(finalAmount);
                    }
                    await prisma.customer.update({ where: { id: customerId }, data: { balance: newBalance } });
                }
            }

            return transaction;
        });
    }
    async getTransactionsByUser(userId: string, field?: string, operator?: string, value?: string, endValue?: string) {
        const whereClause = await this.transactionFilterService.buildWhereClause(userId, field, operator, value, endValue);
        return this.transactionRepository.getTransactionsByUser(whereClause);
    }
    async getTransactionById(userId: string, transactionId: string) {
        return this.transactionRepository.getTransactionById(userId, transactionId);
    }

    async getProfitLast30Days(userId: string): Promise<Prisma.Decimal> {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const result = await this.prisma.transaction.aggregate({
            _sum: {
                profit: true,
            },
            where: {
                userId,
                type: 'SALE',
                createdAt: {
                    gte: thirtyDaysAgo,
                },
            },
        });

        return result._sum.profit ?? new Prisma.Decimal(0);
    }

    async updateTransaction(userId: string, transactionId: string, dto: CreateTransactionDto) {
        return this.prisma.$transaction(async (prisma) => {
            const existingTransaction = await prisma.transaction.findUnique({
                where: { id: transactionId, userId },
                include: { items: true },
            });

            if (!existingTransaction) {
                throw new NotFoundException(`Transaction with ID ${transactionId} not found or access denied.`);
            }

            // Revert old stock quantities and customer balance
            if (existingTransaction.type === 'SALE' || existingTransaction.type === 'PURCHASE') {
                for (const item of existingTransaction.items) {
                    await this.stockService.updateStock(userId, item.productId, -item.quantity, existingTransaction.type);
                }
            }

            if (existingTransaction.customerId) {
                const customer = await prisma.customer.findUnique({ where: { id: existingTransaction.customerId } });
                if (customer) {
                    let oldBalance = new Prisma.Decimal(customer.balance);
                    if (existingTransaction.type === TransactionType.SALE) {
                        oldBalance = oldBalance.minus(existingTransaction.finalAmount);
                    } else if (existingTransaction.type === TransactionType.PURCHASE) {
                        oldBalance = oldBalance.plus(existingTransaction.finalAmount);
                    }
                    await prisma.customer.update({ where: { id: existingTransaction.customerId }, data: { balance: oldBalance } });
                }
            }

            const { type, discountAmount = 0, items, invoiceDate, dueDate, vatRate, currency } = dto;

            // Check new stock quantities
            if (type === 'SALE') {
                for (const item of items) {
                    const stock = await prisma.stock.findFirst({ where: { productId: item.productId, userId } });
                    if (!stock || stock.quantity < item.quantity) {
                        const product = await prisma.product.findUnique({ where: { id: item.productId } });
                        throw new BadRequestException(`Yetersiz stok: ${product?.name ?? item.productId}`);
                    }
                }
            }

            const totalAmount = new Prisma.Decimal(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
            const finalAmount = new Prisma.Decimal(totalAmount.minus(discountAmount));

            let profit = new Prisma.Decimal(0);
            if (type === 'SALE') {
                for (const item of items) {
                    const product = await prisma.product.findUnique({ where: { id: item.productId } });
                    if (!product) {
                        throw new NotFoundException(`Product with ID ${item.productId} not found.`);
                    }
                    const itemProfit = new Prisma.Decimal(item.price).minus(product.price).times(item.quantity);

                    if (product.currency === 'TRY') {
                        profit = profit.plus(itemProfit);
                    } else {
                        const exchangeRate = await prisma.exchange.findUnique({ where: { code: product.currency } });
                        if (!exchangeRate) {
                            throw new NotFoundException(`Exchange rate for ${product.currency} not found.`);
                        }
                        profit = profit.plus(itemProfit.times(exchangeRate.rate));
                    }
                }
            }

            await prisma.transactionItem.deleteMany({ where: { transactionId } });

            if (items && items.length > 0) {
                await prisma.transactionItem.createMany({
                    data: items.map((item) => ({
                        transactionId: transactionId,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                        unit: item.unit,
                        vatRate: item.vatRate,
                    })),
                });
            }

            // Update stock with new quantities
            if (type === 'SALE' || type === 'PURCHASE') {
                for (const item of items) {
                    await this.stockService.updateStock(userId, item.productId, item.quantity, type);
                }
            }

            if (type === 'PURCHASE') {
                for (const item of items) {
                    await prisma.product.update({
                        where: { id: item.productId },
                        data: { price: item.price },
                    });
                }
            }

            const updatedTransaction = await prisma.transaction.update({
                where: { id: transactionId },
                data: {
                    type,
                    totalAmount,
                    discountAmount: new Prisma.Decimal(discountAmount),
                    finalAmount,
                    profit: type === 'SALE' ? profit : null,
                    invoiceDate: invoiceDate ? new Date(invoiceDate) : null,
                    dueDate: dueDate ? new Date(dueDate) : null,
                    vatRate,
                    currency,
                },
            });

            if (updatedTransaction.customerId) {
                const customer = await prisma.customer.findUnique({ where: { id: updatedTransaction.customerId } });
                if (customer) {
                    let newBalance = new Prisma.Decimal(customer.balance);
                    if (updatedTransaction.type === TransactionType.SALE) {
                        newBalance = newBalance.plus(finalAmount);
                    } else if (updatedTransaction.type === TransactionType.PURCHASE) {
                        newBalance = newBalance.minus(finalAmount);
                    }
                    await prisma.customer.update({ where: { id: updatedTransaction.customerId }, data: { balance: newBalance } });
                }
            }

            return updatedTransaction;
        });
    }

    async deleteTransaction(userId: string, transactionId: string) {
        await this.prisma.$transaction(async (prisma) => {
            const transaction = await prisma.transaction.findUnique({
                where: { id: transactionId, userId },
                include: { items: true },
            });

            if (!transaction) {
                throw new NotFoundException(`Transaction with ID ${transactionId} not found or access denied.`);
            }

            // Revert stock quantities and customer balance before deleting the transaction
            if (transaction.type === 'SALE' || transaction.type === 'PURCHASE') {
                for (const item of transaction.items) {
                    await this.stockService.updateStock(userId, item.productId, -item.quantity, transaction.type);
                }
            }

            if (transaction.customerId) {
                const customer = await prisma.customer.findUnique({ where: { id: transaction.customerId } });
                if (customer) {
                    let oldBalance = new Prisma.Decimal(customer.balance);
                    if (transaction.type === TransactionType.SALE) {
                        oldBalance = oldBalance.minus(transaction.finalAmount);
                    } else if (transaction.type === TransactionType.PURCHASE) {
                        oldBalance = oldBalance.plus(transaction.finalAmount);
                    }
                    await prisma.customer.update({ where: { id: transaction.customerId }, data: { balance: oldBalance } });
                }
            }

            await prisma.transactionItem.deleteMany({ where: { transactionId } });
            await prisma.transaction.delete({ where: { id: transactionId } });
        });
    }
}



