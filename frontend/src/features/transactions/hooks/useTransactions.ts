import { useState, useEffect, useCallback } from 'react';
import { getTransactions } from '../services/transactionService';
import axiosClient from '../../../services/axiosClient';
import type { Transaction } from '../../../types';

interface TransactionFilter {
    field: string;
    operator: string;
    value: string;
    endValue?: string;
}

export const useTransactions = (initialFilter: TransactionFilter) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filter, setFilter] = useState<TransactionFilter>(initialFilter);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params: Record<string, string> = {
                field: filter.field,
                operator: filter.operator,
                value: filter.value,
            };
            if (filter.operator === 'between' && filter.endValue) {
                params.endValue = filter.endValue;
            }
            const response = await getTransactions(axiosClient, params);
            setTransactions(response);
        } catch (err) {
            console.error('İşlemler getirilirken hata oluştu:', err);
            setError('İşlemler yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        void fetchTransactions();
    }, [fetchTransactions]);

    return {
        transactions,
        filter,
        setFilter,
        loading,
        error,
        fetchTransactions,
    };
};
