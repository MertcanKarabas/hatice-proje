import { useState, useEffect, useCallback } from 'react';
import { getProducts, deleteProduct } from '../services/productService';
import axiosClient from '../../../services/axiosClient';
import type { Product } from '../../../types';

interface ProductFilter {
    field: string;
    operator: string;
    value: string | number;
}

export const useProducts = (initialFilter: ProductFilter) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filter, setFilter] = useState<ProductFilter>(initialFilter);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getProducts(axiosClient, {
                field: filter.field,
                operator: filter.operator,
                value: filter.value,
            });
            setProducts(res.data);
        } catch (err) {
            console.error('Ürünler getirilirken hata oluştu:', err);
            setError('Ürünler yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        void fetchProducts();
    }, [fetchProducts]);

    const handleDelete = useCallback(async (id: string) => {
        try {
            await deleteProduct(axiosClient, id);
            void fetchProducts(); // Re-fetch products after deletion
        } catch (err) {
            console.error('Ürün silinirken hata oluştu:', err);
            setError('Ürün silinirken bir hata oluştu.');
        }
    }, [fetchProducts]);

    return {
        products,
        filter,
        setFilter,
        loading,
        error,
        fetchProducts,
        handleDelete,
    };
};
