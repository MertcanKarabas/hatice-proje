import { useState, useEffect, useCallback } from 'react';
import { getCustomers } from '../../customers/services/customerService';
import axiosClient from '../../../services/axiosClient';
import type { Customer } from '../../../types';

export const useTransactionForm = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await getCustomers(axiosClient);
                setCustomers(response);
            } catch (err) {
                console.error('Müşteriler getirilirken hata oluştu:', err);
                setError('Müşteriler yüklenirken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };
        void fetchCustomers();
    }, []);

    const handleCustomerAdded = useCallback((newCustomer: Customer) => {
        setCustomers(prev => [...prev, newCustomer].sort((a, b) => a.commercialTitle.localeCompare(b.commercialTitle)));
    }, []);

    return {
        customers,
        loading,
        error,
        handleCustomerAdded,
    };
};
