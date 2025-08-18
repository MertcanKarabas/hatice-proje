import type { Customer, Product, Transaction } from "../types";
import type { IHttpClient } from "./httpClient";

export const getCustomers = async (client: IHttpClient) => {
    const data = await client.get<Customer[]>('/customers');
    console.log('getCustomers raw data from axiosClient:', data);
    return data;
};

export const getProducts = async (client: IHttpClient) => {
    const data = await client.get<{ data: Product[] }>('/products');
    console.log('getProducts raw data from axiosClient:', data);
    return data;
};

export const getTransactions = async (client: IHttpClient) => {
    const data = await client.get<Transaction[]>('/transactions');
    console.log('getTransactions raw data from axiosClient:', data);
    return data;
};

export const getProfitLast30Days = async (client: IHttpClient) => {
    const data = await client.get<{ profit: number }>('/transactions/stats/profit-last-30-days');
    return data;
};
