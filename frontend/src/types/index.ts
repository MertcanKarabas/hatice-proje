export interface Customer {
    id: string;
    commercialTitle: string;
    address: string;
    phone: string;
    taxOffice: string;
    taxNumber: string;
    email: string;
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
}

export interface Transaction {
    customerId: string;
    invoiceDate: Date;
    dueDate: Date;
    vatRate: number;
    currency: string;
    transactionType: 'SALE' | 'PURCHASE';
}
