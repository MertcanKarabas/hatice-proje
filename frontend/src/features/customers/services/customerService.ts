import type { Customer, Transaction, CreatePaymentCollectionDtoFrontend } from '../../../types';
import type { IHttpClient } from '../../../services/httpClient';

export const getCustomers = (client: IHttpClient, params?: Record<string, string | number>) => client.get<Customer[]>('/customers', { params });

export const createCustomer = (client: IHttpClient, data: Omit<Customer, 'id'>) => client.post<Customer>('/customers', data);

export const updateCustomer = (client: IHttpClient, id: string, data: Partial<Customer>) => client.put<Customer>(`/customers/${id}`, data);

export const getCustomerTransactions = (client: IHttpClient, customerId: string) => client.get<Transaction[]>(`/customers/${customerId}/transactions`);

export const deleteCustomer = (client: IHttpClient, customerId: string) => client.delete(`/customers/${customerId}`);

export const createPaymentCollection = (client: IHttpClient, data: CreatePaymentCollectionDtoFrontend) => client.post('/customers/payment-collection', data);