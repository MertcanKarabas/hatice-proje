import type { Customer } from '../../../types';
import type { IHttpClient } from '../../../services/httpClient';

export const getCustomers = (client: IHttpClient) => client.get<Customer[]>('/customers');

export const createCustomer = (client: IHttpClient, data: Omit<Customer, 'id'>) => client.post<Customer>('/customers', data);
