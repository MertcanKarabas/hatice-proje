import { useState, useEffect, useCallback } from 'react';
import { getTransactions } from '../../transactions/services/transactionService';
import axiosClient from '../../../services/axiosClient';
import type { Transaction } from '../../../types';

interface Filter {
    field: string;
    operator: string;
    value: string;
    endValue?: string;
}

export const useCustomerTransactions = (customerId: string | undefined, filter?: Filter) => {
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
            };

            if (filter && (filter.value || filter.endValue)) {
                params.field = filter.field;
                params.operator = filter.operator;
                params.value = filter.value;
                if (filter.endValue) {
                    params.endValue = filter.endValue;
                }
            }

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
