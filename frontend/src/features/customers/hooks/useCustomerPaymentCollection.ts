import { useState, useEffect, useCallback } from 'react';
import { getCustomers, createPaymentCollection } from '../services/customerService';
import axiosClient from '../../../services/axiosClient';
import type { Customer, CreatePaymentCollectionDtoFrontend } from '../../../types';
import { useNavigate } from 'react-router-dom';

export const useCustomerPaymentCollection = (customerId: string | undefined) => {
    const navigate = useNavigate();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCustomer = async () => {
            if (customerId) {
                try {
                    const customers = await getCustomers(axiosClient);
                    const foundCustomer = customers.find(c => c.id === customerId);
                    setCustomer(foundCustomer ?? null);
                } catch (err) {
                    console.error('Müşteri bilgileri getirilirken hata oluştu:', err);
                    setError('Müşteri bilgileri yüklenirken bir hata oluştu.');
                } finally {
                    setLoading(false);
                }
            }
        };
        void fetchCustomer();
    }, [customerId]);

    const handleSubmit = useCallback(async (data: CreatePaymentCollectionDtoFrontend) => {
        try {
            await createPaymentCollection(axiosClient, data);
            void navigate(`/customers/${customerId}/transactions`);
        } catch (err) {
            console.error('İşlem kaydedilirken hata oluştu:', err);
            setError('İşlem kaydedilirken bir hata oluştu.');
        }
    }, [customerId, navigate]);

    return {
        customer,
        loading,
        error,
        handleSubmit,
    };
};
