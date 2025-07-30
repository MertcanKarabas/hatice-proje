import React, { useEffect } from 'react';
import { getCustomers } from '../services/customerService';
import axiosClient from '../../../services/axiosClient';
import { Container } from '@mui/material';
import { useState } from 'react';
import type { Customer } from '../../../types';

const Customers: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await getCustomers(axiosClient);
                setCustomers(response);
            } catch (error) {
                console.error('Müşteriler getirilirken hata oluştu:', error);
            }
        };
        void fetchCustomers();
    }, []);

    return (
        <Container maxWidth="xl">
            <h2>Customers</h2>
            <ul>
                {customers.map(customer => (
                    <li key={customer.id}>{customer.commercialTitle}</li>
                ))}
            </ul>
        </Container>
    );
};

export default Customers;
