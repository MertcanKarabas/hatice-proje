import type { Transaction } from '../../../types';
import type { IHttpClient } from '../../../services/httpClient';

export const createTransaction = (client: IHttpClient, data: Transaction) => client.post('/transactions', data);
