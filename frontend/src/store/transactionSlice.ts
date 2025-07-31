import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../types';

interface TransactionItem {
    productId: string;
    quantity: number;
    unit: string;
    price: number;
    vatRate: number;
    total: number;
}

interface TransactionFormState {
    customerId: string;
    invoiceDate: Date;
    dueDate?: Date;
    vatRate: number;
    currency: string;
    transactionType: 'SALE' | 'PURCHASE';
    step: number;
    items?: TransactionItem[];
    products?: Product[]; // To store all products for client-side filtering
}

const initialState: TransactionFormState = {
    customerId: '',
    invoiceDate: new Date(),
    dueDate: new Date(),
    vatRate: 20,
    currency: 'TRY',
    transactionType: 'SALE',
    step: 0,
    items: [],
    products: [],
};

const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {
        setTransactionInfo: (state, action: PayloadAction<Partial<TransactionFormState>>) => {
            Object.assign(state, action.payload);
        },
        nextStep: (state) => {
            state.step += 1;
        },
        prevStep: (state) => {
            state.step = Math.max(0, state.step - 1);
        },
        goToStep: (state, action: PayloadAction<number>) => {
            state.step = action.payload;
        },
        resetTransaction: () => initialState,
    },
});

export const {
    setTransactionInfo,
    resetTransaction,
    nextStep,
    prevStep,
    goToStep,
} = transactionSlice.actions;

export default transactionSlice.reducer;
