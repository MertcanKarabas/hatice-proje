import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, TextField, Button, Box, MenuItem, Select, FormControl, Alert
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
    }, [transactionInfo.type, transactionInfo.vatRate, navigate]);

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
        const product = allProducts.find(p => p.id === id);
        if (field === 'selectedQuantity' && product && transactionInfo.type === 'SALE' && Number(value) > product.quantity) {
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
                    inputProps={{ min: 0, ...(transactionInfo.type === 'SALE' && { max: params.row.quantity }) }}
                    error={transactionInfo.type === 'SALE' && params.row.selectedQuantity > params.row.quantity}
                    helperText={transactionInfo.type === 'SALE' && params.row.selectedQuantity > params.row.quantity ? `Stok: ${params.row.quantity}` : ''}
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
        if (transactionInfo.type === 'SALE') {
            const hasInvalidQuantity = selectedProducts.some(p => p.selectedQuantity > p.quantity);
            if (hasInvalidQuantity) {
                setWarning('Lütfen stok miktarını aşan ürünleri düzeltin.');
                return;
            }
        }

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
            {warning && <Alert severity="warning">{warning}</Alert>}
            <Box mb={2}>
                <TextField
                    fullWidth
                    label="Ürün Ara (Stok Kodu veya Adı)"
                    variant="outlined"
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
