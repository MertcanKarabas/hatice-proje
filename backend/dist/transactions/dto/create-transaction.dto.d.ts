export declare class CreateTransactionItemDto {
    productId: string;
    quantity: number;
    price: number;
    unit: string;
    vatRate: number;
}
export declare class CreateTransactionDto {
    type: 'SALE' | 'PURCHASE' | 'PAYMENT' | 'COLLECTION';
    customerId?: string;
    discountAmount?: number;
    items: CreateTransactionItemDto[];
    invoiceDate?: string;
    dueDate?: string;
    vatRate?: number;
    currency?: string;
}
