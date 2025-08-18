import { useState, useEffect, useCallback } from 'react';
import { getProducts } from '../../products/services/productService';
import axiosClient from '../../../services/axiosClient';
import type { Product } from '../../../types';

interface SelectedProduct extends Product {
    selectedQuantity: number;
    selectedUnit: string;
    selectedPrice: number;
    selectedVatRate: number;
    total: number;
}

export const useProductSelection = (initialVatRate: number, transactionType: 'SALE' | 'PURCHASE' | 'PAYMENT' | 'COLLECTION') => {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<SelectedProduct[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [warning, setWarning] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts(axiosClient);
                const productsWithDefaults: SelectedProduct[] = response.data.map(product => ({
                    ...product,
                    selectedQuantity: 0,
                    selectedUnit: product.unit,
                    selectedPrice: product.price,
                    selectedVatRate: initialVatRate || 0,
                    total: 0,
                }));
                setAllProducts(response.data);
                setFilteredProducts(productsWithDefaults);
                setSelectedProducts(productsWithDefaults);
            } catch (error) {
                console.error('Ürünler getirilirken hata oluştu:', error);
            }
        };
        void fetchProducts();
    }, [initialVatRate]);

    useEffect(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const filtered = allProducts.filter(product =>
            product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            product.sku.toLowerCase().includes(lowerCaseSearchTerm)
        ).map(product => {
            const existingSelected = selectedProducts.find(p => p.id === product.id);
            return existingSelected ?? {
                ...product,
                selectedQuantity: 0,
                selectedUnit: product.unit,
                selectedPrice: product.price,
                selectedVatRate: initialVatRate || 0,
                total: 0,
            };
        });
        setFilteredProducts(filtered);
    }, [searchTerm, allProducts, selectedProducts, initialVatRate]);

    const calculateTotal = useCallback((quantity: number, price: number, vatRate: number) => {
        return quantity * price * (1 + vatRate / 100);
    }, []);

    const handleInputChange = useCallback(
        (id: string, field: keyof SelectedProduct, value: string | number) => {
            const product = allProducts.find(p => p.id === id);
            if (field === 'selectedQuantity' && product && transactionType === 'SALE' && Number(value) > product.quantity) {
                setWarning(`Stokta yeterli ürün yok. Kalan: ${product.quantity}`);
                return;
            }
            setWarning(null);

            setSelectedProducts(prevProducts =>
                prevProducts.map(p => {
                    if (p.id === id) {
                        const updatedProduct = { ...p, [field]: value };
                        const total = calculateTotal(
                            Number(updatedProduct.selectedQuantity),
                            Number(updatedProduct.selectedPrice),
                            Number(updatedProduct.selectedVatRate)
                        );
                        return { ...updatedProduct, total };
                    }
                    return p;
                })
            );
            setFilteredProducts(prevFiltered =>
                prevFiltered.map(p => {
                    if (p.id === id) {
                        const updatedProduct = { ...p, [field]: value };
                        const total = calculateTotal(
                            Number(updatedProduct.selectedQuantity),
                            Number(updatedProduct.selectedPrice),
                            Number(updatedProduct.selectedVatRate)
                        );
                        return { ...updatedProduct, total };
                    }
                    return p;
                })
            );
        },
        [allProducts, calculateTotal, transactionType]
    );

    return {
        allProducts,
        filteredProducts,
        selectedProducts,
        searchTerm,
        setSearchTerm,
        warning,
        handleInputChange,
    };
};
