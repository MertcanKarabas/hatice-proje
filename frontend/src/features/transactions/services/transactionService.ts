

import type { CreateTransactionDtoFrontend, Transaction } from 'src/types';
import type { IHttpClient } from '../../../services/httpClient';

export const createTransaction = (client: IHttpClient, data: CreateTransactionDtoFrontend) => client.post('/transactions', data);

export const getTransactions = (client: IHttpClient, params?: Record<string, string | number>) => client.get<Transaction[]>('/transactions', { params });

export const getTransactionById = (client: IHttpClient, id: string) => client.get<Transaction>(`/transactions/${id}`);

export const updateTransaction = (client: IHttpClient, id: string, data: CreateTransactionDtoFrontend) => client.put<Transaction>(`/transactions/${id}`, data);

export const deleteTransaction = (client: IHttpClient, id: string) => client.delete(`/transactions/${id}`);