import { useState, useEffect, useCallback } from 'react';
import { getCustomers } from '../services/customerService';
import axiosClient from '../../../services/axiosClient';
import type { Customer } from '../../../types';

interface CustomerFilter {
    field: string;
    operator: string;
    value: string;
}

export const useCustomers = (initialFilter: CustomerFilter) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [filter, setFilter] = useState<CustomerFilter>(initialFilter);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCustomers(axiosClient, {
                field: filter.field,
                operator: filter.operator,
                value: filter.value,
            });
            setCustomers(response);
        } catch (err) {
            console.error('Müşteriler getirilirken hata oluştu:', err);
            setError('Müşteriler yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        void fetchCustomers();
    }, [fetchCustomers]);

    const handleCustomerSaved = useCallback((savedCustomer: Customer) => {
        setCustomers((prevCustomers) => {
            const existingIndex = prevCustomers.findIndex(c => c.id === savedCustomer.id);
            if (existingIndex > -1) {
                const updatedCustomers = [...prevCustomers];
                updatedCustomers[existingIndex] = savedCustomer;
                return updatedCustomers;
            } else {
                return [...prevCustomers, savedCustomer];
            }
        });
    }, []);

    const handleCustomerDeleted = useCallback((deletedCustomerId: string) => {
        setCustomers((prevCustomers) =>
            prevCustomers.filter((c) => c.id !== deletedCustomerId)
        );
    }, []);

    return {
        customers,
        filter,
        setFilter,
        loading,
        error,
        fetchCustomers,
        handleCustomerSaved,
        handleCustomerDeleted,
    };
};
