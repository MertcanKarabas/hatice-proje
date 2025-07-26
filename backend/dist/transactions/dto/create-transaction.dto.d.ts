export declare class CreateTransactionItemDto {
    productId: string;
    quantity: number;
    price: number;
}
export declare class CreateTransactionDto {
    type: 'SALE' | 'PURCHASE';
    discountAmount?: number;
    items: CreateTransactionItemDto[];
}
