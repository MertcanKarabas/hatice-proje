import type { Customer, Product, Transaction } from "../types";
import type { IHttpClient } from "./httpClient";

export const getCustomers = async (client: IHttpClient) => {
    const data = await client.get<Customer[]>('/customers');
    return data;
};

export const getProducts = async (client: IHttpClient) => {
    const data = await client.get<{ data: Product[] }>('/products');
    return data;
};

export const getTransactions = async (client: IHttpClient) => {
    const data = await client.get<Transaction[]>('/transactions');
    return data;
};

export const getProfitLast30Days = async (client: IHttpClient) => {
    const data = await client.get<{ profit: number }>('/transactions/stats/profit-last-30-days');
    return data;
};

export const getSalesOverview = async (client: IHttpClient) => {
    const data = await client.get<{ today: number; thisWeek: number; thisMonth: number }>('/transactions/stats/sales-overview');
    return data;
};
