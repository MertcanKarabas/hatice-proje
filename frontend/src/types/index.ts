export interface Customer {
    id: string;
    commercialTitle: string;
    address: string;
    phone: string;
    taxOffice: string;
    taxNumber: string;
    email: string;
    type: 'SALES' | 'PURCHASE';
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
    customerId: string;
    invoiceDate: string;
    dueDate: string;
    vatRate: number;
    currency: string;
    transactionType: 'SALE' | 'PURCHASE';
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
