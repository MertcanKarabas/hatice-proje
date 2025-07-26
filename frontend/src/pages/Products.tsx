import React, { useEffect, useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import API from '../services/api';
import ProductFormDialog from '../components/ProductFormDialog';

const Products: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any | null>(null);

    const fetchProducts = async () => {
        const res = await API.get('/products');
        console.log("RESS:", res);
        setProducts(res.data.data);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Adı', flex: 1 },
        { field: 'sku', headerName: 'Stok Kodu', flex: 1 },
        { field: 'price', headerName: 'Fiyat', flex: 1 },
        {
            field: 'actions',
            headerName: 'İşlemler',
            renderCell: (params) => (
                <>
                    <Button onClick={() => handleEdit(params.row)}>Düzenle</Button>
                    <Button color="error" onClick={() => handleDelete(params.row.id)}>Sil</Button>
                </>
            ),
            flex: 1,
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
        <Container>
            <Typography variant="h4" gutterBottom>Ürünler</Typography>
            <Button variant="contained" onClick={() => { setSelected(null); setOpen(true); }}>
                Ürün Ekle
            </Button>

            <div style={{ height: 400, marginTop: 20 }}>
                <DataGrid checkboxSelection rows={products} columns={columns} getRowId={(row) => row.id} />
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
