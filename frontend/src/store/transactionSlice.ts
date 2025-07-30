import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface TransactionFormState {
    customerId: string;
    invoiceDate: Date;
    dueDate?: Date;
    vatRate: number;
    currency: string;
    step: number;
}

const initialState: TransactionFormState = {
    customerId: '',
    invoiceDate: new Date(),
    dueDate: new Date(),
    vatRate: 20,
    currency: 'TRY',
    step: 0,
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
