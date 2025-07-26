import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button
} from '@mui/material';
import API from '../services/api';

interface Props {
    open: boolean;
    onClose: () => void;
    initialData: any | null;
}

const ProductFormDialog: React.FC<Props> = ({ open, onClose, initialData }) => {
    const [form, setForm] = useState({ name: '', price: '', sku: '', description: '' });

    useEffect(() => {
        if (initialData) {
            setForm(initialData);
        } else {
            setForm({ name: '', price: '', sku: '', description: '' });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const payload = {
            name: form.name,
            sku: form.sku,
            price: Number(form.price),
            description: form.description,
        };
        if (initialData) {
            await API.put(`/products/${initialData.id}`, payload);
        } else {
            await API.post('/products', payload);
        }
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{initialData ? 'Ürünü Düzenle' : 'Ürün Ekle'}</DialogTitle>
            <DialogContent>
                <TextField label="Ad" name="name" fullWidth margin="dense" value={form.name} onChange={handleChange} />
                <TextField label="Stok Kodu" name="sku" fullWidth margin="dense" value={form.sku} onChange={handleChange} />
                <TextField label="Fiyat" name="price" fullWidth margin="dense" type='number' value={form.price} onChange={handleChange} />
                <TextField label="Açıklama" name="description" fullWidth margin="dense" value={form.description} onChange={handleChange} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>İptal</Button>
                <Button variant="contained" onClick={handleSubmit}>Kaydet</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductFormDialog;
