import React, { useEffect, useState } from 'react';
import {
    Button, Container, Typography, TextField, MenuItem, Grid
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import API from '../services/api';
import ProductFormDialog from '../components/forms/ProductFormDialog';
import ProductFilter from '../components/FilterOperators';


const filterFields = [
    { value: 'name', label: 'Adı' },
    { value: 'sku', label: 'Stok Kodu' },
    { value: 'price', label: 'Fiyat' },
    { value: 'unit', label: 'Birim' },
    { value: 'currency', label: 'Döviz' },
];

const Products: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any | null>(null);
    const [filter, setFilter] = useState({
        field: 'name',
        operator: 'contains',
        value: '',
    });
    const [filterField, setFilterField] = useState<string>('name');
    const [filterValue, setFilterValue] = useState<string>('');

    const applyFilter = async () => {
        const res = await API.get('/products', {
            params: {
                field: filter.field,
                operator: filter.operator,
                value: filter.value,
            },
        });

        setProducts(res.data.data);
        setFilteredProducts(res.data.data); // BUNU EKLE
    };

    const fetchProducts = async () => {
        const res = await API.get('/products');
        setProducts(res.data.data);
        setFilteredProducts(res.data.data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleFilter = () => {
        const filtered = products.filter((product) => {
            const fieldValue = product[filterField];
            if (fieldValue == null) return false;
            return fieldValue.toString().toLowerCase().includes(filterValue.toLowerCase());
        });
        setFilteredProducts(filtered);
    };

    const columns: GridColDef[] = [
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
                    <Button color="error" onClick={() => handleDelete(params.row.id)}>Sil</Button>
                </>
            ),
            flex: 2,
        },
    ];

    const handleEdit = (row: any) => {
        setSelected(row);
        setOpen(true);
    };

    const handleDelete = async (id: string) => {
        await API.delete(`/products/${id}`);
        fetchProducts();
    };

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" gutterBottom>Ürünler</Typography>
            <Button variant="contained" onClick={() => { setSelected(null); setOpen(true); }}>
                Ürün Ekle
            </Button>
            <ProductFilter filter={filter} setFilter={setFilter} onApply={applyFilter} />

            <div style={{ height: 400, marginTop: 20 }}>
                <DataGrid
                    rows={products}
                    columns={columns}
                    getRowId={(row) => row.id}
                />
            </div>

            <ProductFormDialog
                open={open}
                onClose={() => { setOpen(false); fetchProducts(); }}
                initialData={selected}
            />
        </Container>
    );
};

export default Products;
