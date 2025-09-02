import React, { useState } from 'react';
import {
    Button, Container, Typography
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import ProductFormDialog from './ProductFormDialog';
import ProductFilter from './FilterOperators';
import type { Product } from '../../../types';
import { useProducts } from '../hooks/useProducts';

const Products: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Product | null>(null);

    const {
        products,
        filter,
        setFilter,
        fetchProducts,
        handleDelete,
    } = useProducts({
        field: 'name',
        operator: 'contains',
        value: '',
    });

    const columns: GridColDef<Product>[] = [
        { field: 'name', headerName: 'Adı', flex: 1 },
        { field: 'sku', headerName: 'Stok Kodu', flex: 1 },
        { field: 'quantity', headerName: 'Adet', flex: 1 },
        { field: 'unit', headerName: 'Birim', flex: 1 },
        { field: 'price', headerName: 'Fiyat', flex: 1 },
        {
            field: 'actions',
            headerName: 'İşlemler',
            renderCell: (params) => (
                <>
                    <Button onClick={() => handleEdit(params.row)}>Düzenle</Button>
                    <Button color="error" onClick={() => {
                        void handleDelete(params.row.id);
                    }}>Sil</Button>
                </>
            ),
            flex: 2,
        },
    ];

    const handleEdit = (row: Product) => {
        setSelected(row);
        setOpen(true);
    };

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" gutterBottom>Ürünler</Typography>
            <Button variant="contained" onClick={() => { setSelected(null); setOpen(true); }}>
                Ürün Ekle
            </Button>
            <ProductFilter filter={filter} setFilter={setFilter} onApply={fetchProducts} />

            <div style={{ height: 400, marginTop: 20 }}>
                <DataGrid
                    rows={products}
                    columns={columns}
                    getRowId={(row) => row.id}
                />
            </div>

            <ProductFormDialog
                open={open}
                onClose={() => { setOpen(false); void fetchProducts(); }}
                initialData={selected}
            />
        </Container>
    );
};

export default Products;
