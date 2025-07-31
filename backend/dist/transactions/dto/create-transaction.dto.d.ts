export declare class CreateTransactionItemDto {
    productId: string;
    quantity: number;
    price: number;
    unit: string;
    vatRate: number;
}
export declare class CreateTransactionDto {
    type: 'SALE' | 'PURCHASE';
    discountAmount?: number;
    items: CreateTransactionItemDto[];
}
