export declare enum PaymentCollectionType {
    COLLECTION = "COLLECTION",
    PAYMENT = "PAYMENT"
}
export declare class CreatePaymentCollectionDto {
    customerId: string;
    amount: number;
    type: PaymentCollectionType;
    date: string;
    description?: string;
}
