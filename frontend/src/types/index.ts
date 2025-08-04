export interface Customer {
    id: string;
    commercialTitle: string;
    address: string;
    phone: string;
    taxOffice: string;
    taxNumber: string;
    email: string;
    type: 'SALES' | 'PURCHASE';
    balance: number;
}

export interface Product {
    id: string;
    name: string;
    sku: string;
    quantity: number;
    unit: string;
    price: number;
    currency: string;
    description: string;
    isPackage: boolean;
    packageComponents: { component: Product; quantity: number }[];
}

export interface Transaction {
    id: string;
    customerId: string;
    invoiceDate: string;
    dueDate: string;
    vatRate: number;
    currency: string;
    transactionType: 'SALE' | 'PURCHASE';
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    createdAt: string;
    updatedAt: string;
    items: TransactionItem[];
}

export interface TransactionItem {
    productId: string;
    quantity: number;
    unit: string;
    price: number;
    vatRate: number;
    total: number;
}

export interface CreateTransactionDtoFrontend {
    customerId: string;
    invoiceDate: string;
    dueDate?: string;
    vatRate: number;
    currency: string;
    type: 'SALE' | 'PURCHASE';
    items: { productId: string; quantity: number; price: number; unit: string; vatRate: number; }[];
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
}

export interface PaymentCollection {
    id: string;
    customerId: string;
    type: 'PAYMENT' | 'COLLECTION';
    amount: number;
    date: string;
    description?: string;
}

export interface CreatePaymentCollectionDtoFrontend {
    customerId: string;
    type: 'PAYMENT' | 'COLLECTION';
    amount: number;
    date: string;
    description?: string;
}
