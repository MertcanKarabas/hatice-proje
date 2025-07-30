import React, { useEffect, useState } from 'react';
import {
    Button, Container, Typography
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { getProducts, deleteProduct } from '../services/productService';
import axiosClient from '../../../services/axiosClient';
import ProductFormDialog from './ProductFormDialog';
import ProductFilter from './FilterOperators';
import type { Product } from '../../../types';

const Products: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Product | null>(null);
    const [filter, setFilter] = useState<{ field: string; operator: string; value: string | number }>({ 
        field: 'name',
        operator: 'contains',
        value: '',
    });

    const applyFilter = async () => {
        const res = await getProducts(axiosClient, {
            field: filter.field,
            operator: filter.operator,
            value: filter.value,
        });

        setProducts(res.data);
    };

    const fetchProducts = async () => {
        const res = await getProducts(axiosClient);
        setProducts(res.data);
    };

    useEffect(() => {
        void fetchProducts();
    }, []);

    const columns: GridColDef<Product>[] = [
        { field: 'name', headerName: 'Adı', flex: 1 },
        { field: 'sku', headerName: 'Stok Kodu', flex: 1 },
        { field: 'quantity', headerName: 'Adet', flex: 1 },
        { field: 'unit', headerName: 'Birim', flex: 1 },
        { field: 'price', headerName: 'Fiyat', flex: 1 },
        { field: 'currency', headerName: 'Döviz', flex: 1 },
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

    const handleDelete = async (id: string) => {
        await deleteProduct(axiosClient, id);
        void fetchProducts();
    };

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" gutterBottom>Ürünler</Typography>
            <Button variant="contained" onClick={() => { setSelected(null); setOpen(true); }}>
                Ürün Ekle
            </Button>
            <ProductFilter filter={filter} setFilter={setFilter} onApply={() => {
                void applyFilter();
            }} />

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
