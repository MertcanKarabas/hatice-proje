import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, TextField, Button, Box, MenuItem, Select, FormControl
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { getProducts } from '../../products/services/productService';
import axiosClient from '../../../services/axiosClient';
import type { RootState } from '../../../store/store';
import { setTransactionInfo } from '../../../store/transactionSlice';
import type { Product } from '../../../types';

interface SelectedProduct extends Product {
    selectedQuantity: number;
    selectedUnit: string;
    selectedPrice: number;
    selectedVatRate: number;
    total: number;
}

const ProductUnit = {
    ADET: 'ADET',
    DESTE: 'DESTE',
    PAKET: 'PAKET',
};

const TransactionSelectProducts: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const transactionInfo = useSelector((state: RootState) => state.transaction);

    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<SelectedProduct[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        if (transactionInfo.transactionType === 'SALE') {
            const fetchProducts = async () => {
                try {
                    const response = await getProducts(axiosClient);
                    const productsWithDefaults: SelectedProduct[] = response.data.map(product => ({
                        ...product,
                        selectedQuantity: 0,
                        selectedUnit: product.unit,
                        selectedPrice: product.price,
                        selectedVatRate: transactionInfo.vatRate || 0,
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
        } else {
            // Handle PURCHASE or other types if needed
            // For now, navigate back or show an error
            console.warn('Only SALE transactions are supported for product selection.');
            void navigate('/transactions/new');
        }
    }, [transactionInfo.transactionType, transactionInfo.vatRate, navigate]);

    useEffect(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const filtered = allProducts.filter(product =>
            product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            product.sku.toLowerCase().includes(lowerCaseSearchTerm)
        ).map(product => {
            const existingSelected = selectedProducts.find(p => p.id === product.id);
            return existingSelected || {
                ...product,
                selectedQuantity: 0,
                selectedUnit: product.unit,
                selectedPrice: product.price,
                selectedVatRate: transactionInfo.vatRate || 0,
                total: 0,
            };
        });
        setFilteredProducts(filtered);
    }, [searchTerm, allProducts, selectedProducts, transactionInfo.vatRate]);

    const calculateTotal = (quantity: number, price: number, vatRate: number) => {
        return quantity * price * (1 + vatRate / 100);
    };

    const handleInputChange = (
        id: string,
        field: keyof SelectedProduct,
        value: string | number
    ) => {
        setSelectedProducts(prevProducts =>
            prevProducts.map(product => {
                if (product.id === id) {
                    const updatedProduct = { ...product, [field]: value };
                    const total = calculateTotal(
                        Number(updatedProduct.selectedQuantity),
                        Number(updatedProduct.selectedPrice),
                        Number(updatedProduct.selectedVatRate)
                    );
                    return { ...updatedProduct, total };
                }
                return product;
            })
        );
        setFilteredProducts(prevFiltered =>
            prevFiltered.map(product => {
                if (product.id === id) {
                    const updatedProduct = { ...product, [field]: value };
                    const total = calculateTotal(
                        Number(updatedProduct.selectedQuantity),
                        Number(updatedProduct.selectedPrice),
                        Number(updatedProduct.selectedVatRate)
                    );
                    return { ...updatedProduct, total };
                }
                return product;
            })
        );
    };

    const columns: GridColDef<SelectedProduct>[] = [
        { field: 'sku', headerName: 'Stok Kodu', flex: 1, editable: false },
        { field: 'name', headerName: 'Ürün Adı', flex: 1, editable: false },
        {
            field: 'selectedQuantity',
            headerName: 'Miktar',
            flex: 0.5,
            renderCell: (params: GridRenderCellParams<SelectedProduct>) => (
                <TextField
                    type="number"
                    value={params.row.selectedQuantity}
                    onChange={(e) => handleInputChange(params.row.id, 'selectedQuantity', Number(e.target.value))}
                    size="small"
                    fullWidth
                    inputProps={{ min: 0 }}
                />
            ),
        },
        {
            field: 'selectedUnit',
            headerName: 'Birim',
            flex: 0.5,
            renderCell: (params: GridRenderCellParams<SelectedProduct>) => (
                <FormControl fullWidth size="small">
                    <Select
                        value={params.row.selectedUnit}
                        onChange={(e) => handleInputChange(params.row.id, 'selectedUnit', e.target.value)}
                        displayEmpty
                    >
                        {Object.keys(ProductUnit).map((unit) => (
                            <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ),
        },
        {
            field: 'selectedPrice',
            headerName: 'Birim Fiyat',
            flex: 0.5,
            renderCell: (params: GridRenderCellParams<SelectedProduct>) => (
                <TextField
                    type="number"
                    value={params.row.selectedPrice}
                    onChange={(e) => handleInputChange(params.row.id, 'selectedPrice', Number(e.target.value))}
                    size="small"
                    fullWidth
                    inputProps={{ min: 0 }}
                />
            ),
        },
        {
            field: 'selectedVatRate',
            headerName: 'KDV (%)',
            flex: 0.5,
            renderCell: (params: GridRenderCellParams<SelectedProduct>) => (
                <TextField
                    type="number"
                    value={params.row.selectedVatRate}
                    onChange={(e) => handleInputChange(params.row.id, 'selectedVatRate', Number(e.target.value))}
                    size="small"
                    fullWidth
                    inputProps={{ min: 0, max: 100 }}
                />
            ),
        },
        { field: 'total', headerName: 'Toplam', flex: 0.7, valueFormatter: (params: { value: number }) => params.value },
    ];

    const handleNext = () => {
        const items = selectedProducts.filter(p => p.selectedQuantity > 0).map(p => ({
            productId: p.id,
            quantity: p.selectedQuantity,
            unit: p.selectedUnit,
            price: p.selectedPrice,
            vatRate: p.selectedVatRate,
            total: p.total,
        }));

        dispatch(setTransactionInfo({ items, products: allProducts }));
        void navigate('/transactions/summary');
    };

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" gutterBottom>Ürün Seçimi</Typography>
            <Box mb={2}>
                <TextField
                    label="Ürün Ara (Stok Kodu veya Adı)"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Box>
            <div style={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={filteredProducts}
                    columns={columns}
                    getRowId={(row) => row.id}
                    processRowUpdate={(newRow) => {
                        // This is a workaround for DataGrid's internal state management
                        // The actual state update happens in handleInputChange
                        return newRow;
                    }}
                    onProcessRowUpdateError={(error) => console.error(error)}
                />
            </div>
            <Box mt={2} display="flex" justifyContent="flex-end">
                <Button variant="contained" onClick={handleNext}>
                    Özet Sayfasına Git
                </Button>
            </Box>
        </Container>
    );
};

export default TransactionSelectProducts;
