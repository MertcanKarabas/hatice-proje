export interface Exchange {
    id: string;
    name: string;
    code: string;
    rate: number;
}

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
    exchangeId?: string;
    exchange?: Exchange;
    createdAt?: string;
    updatedAt?: string;
    userId?: string;
}

export interface Product {
    id: string;
    name: string;
    sku: string;
    quantity: number;
    unit: string;
    price: number;
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
    exchangeId?: string;
    exchange?: Exchange;
    type: 'SALE' | 'PURCHASE' | 'PAYMENT' | 'COLLECTION';
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    createdAt: string;
    updatedAt: string;
    items: TransactionItem[];
    customer?: Customer;
    profit?: number;
    customerPreviousBalance?: number;
    customerNewBalance?: number;
}

export interface TransactionItem {
    productId: string;
    product: Product;
    quantity: number;
    unit: string;
    price: number;
    vatRate: number;
    total: number;
}

export interface TransactionSummaryData {
    type: 'SALE' | 'PURCHASE' | 'PAYMENT' | 'COLLECTION';
    items?: TransactionItem[];
    products?: Product[];
    customerCommercialTitle?: string;
    invoiceDate: string;
    dueDate?: string;
    totalVat: number;
    grandTotal: number;
    customerPreviousBalance?: number;
    customerNewBalance?: number;
    transactionCurrencyCode?: string; // Added transactionCurrencyCode
}

export interface CreateTransactionDtoFrontend {
    customerId: string;
    invoiceDate: string;
    dueDate?: string;
    vatRate: number;
    exchangeId?: string;
    type: 'SALE' | 'PURCHASE' | 'PAYMENT' | 'COLLECTION';
    items: { productId: string; quantity: number; price: number; unit: string; vatRate: number; }[];
    discountAmount: number;
    customerPreviousBalance: number;
    customerNewBalance: number;
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
    exchangeId?: string;
}
