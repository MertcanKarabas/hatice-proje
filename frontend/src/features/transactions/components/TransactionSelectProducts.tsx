import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, TextField, Button, Box, MenuItem, Select, FormControl, Alert
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import type { RootState } from '../../../store/store';
import { setTransactionInfo } from '../../../store/transactionSlice';
import { useProductSelection } from '../hooks/useProductSelection';
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

const TransactionSelectProducts: React.FC = () => { // Minor change to force re-evaluation
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const transactionInfo = useSelector((state: RootState) => state.transaction);

    const {
        allProducts,
        filteredProducts,
        selectedProducts,
        searchTerm,
        setSearchTerm,
        warning,
        handleInputChange,
    } = useProductSelection(transactionInfo.vatRate || 0, transactionInfo.type);

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