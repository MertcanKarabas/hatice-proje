import { useState, useEffect, useCallback } from 'react';
import { getTransactions } from '../../transactions/services/transactionService';
import axiosClient from '../../../services/axiosClient';
import type { Transaction } from '../../../types';

export const useCustomerTransactions = (customerId: string | undefined, filter?: Record<string, string | number>) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTransactions = useCallback(async () => {
        if (!customerId) return;

        setLoading(true);
        setError(null);
        try {
            const params: Record<string, string | number> = {
                customerId,
                ...(filter || {}),
            };
            const response = await getTransactions(axiosClient, params);
            setTransactions(response);
        } catch (err) {
            console.error('Müşteri işlemleri getirilirken hata oluştu:', err);
            setError('Müşteri işlemleri yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    }, [customerId, filter]);

    useEffect(() => {
        void fetchTransactions();
    }, [fetchTransactions]);

    return {
        transactions,
        loading,
        error,
        fetchTransactions,
    };
};
