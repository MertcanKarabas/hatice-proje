
import type { IHttpClient } from '../../../services/httpClient';
import type { Product } from '../../../types';

export const getProducts = (client: IHttpClient, params?: Record<string, string | number>) => client.get<{data: Product[]}>('/products', { params });

export const createProduct = (client: IHttpClient, data: Partial<Product>) => client.post<Product>('/products', data);

export const updateProduct = (client: IHttpClient, id: string, data: Partial<Product>) => client.put<Product>(`/products/${id}`, data);

export const deleteProduct = (client: IHttpClient, id: string) => client.delete(`/products/${id}`);
