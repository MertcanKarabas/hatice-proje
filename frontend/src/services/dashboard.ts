import axiosClient from "./axiosClient";
import type { Customer, Product, Transaction } from "../types";

export const getCustomers = async () => {
    const data = await axiosClient.get<Customer[]>('/customers');
    console.log('getCustomers raw data from axiosClient:', data);
    return data;
};

export const getProducts = async () => {
    const data = await axiosClient.get<{ data: Product[] }>('/products');
    console.log('getProducts raw data from axiosClient:', data);
    return data;
};

export const getTransactions = async () => {
    const data = await axiosClient.get<Transaction[]>('/transactions');
    console.log('getTransactions raw data from axiosClient:', data);
    return data;
};
