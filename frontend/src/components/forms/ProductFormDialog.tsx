import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button,
    type SelectChangeEvent,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import API from '../../services/api';

interface Props {
    open: boolean;
    onClose: () => void;
    initialData: any | null;
}

const Currency = {
    TRY: 'TRY',
    USD: 'USD',
    EUR: 'EUR',
};

const ProductUnit = {
    ADET: 'ADET',
    DESTE: 'DESTE',
    PAKET: 'PAKET',
};

interface FormState {
    name: string;
    price: string;
    sku: string;
    description: string;
    quantity: string; // Formda string olarak tutmak daha kolaydır
    unit: keyof typeof ProductUnit; // Sadece tanımlı birimler seçilebilir
    currency: keyof typeof Currency;
}


const ProductFormDialog: React.FC<Props> = ({ open, onClose, initialData }) => {
    const getInitialState = (): FormState => ({
        name: '', price: '', sku: '', description: '',
        quantity: '0', unit: 'ADET', currency: 'TRY', // Yeni alan için varsayılan değer
    });
    const [error, setError] = useState<String>("");
    const [form, setForm] = useState<FormState>(getInitialState());

    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name || '',
                price: String(initialData.price || ''),
                sku: initialData.sku || '',
                description: initialData.description || '',
                quantity: String(initialData.quantity || '0'),
                unit: initialData.unit || 'ADET',
                currency: initialData.currency || 'TRY', // Düzenleme için değeri ata
            });
        } else {
            setForm(getInitialState());
        }
    }, [initialData, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async () => {
        const payload = {
            name: form.name,
            sku: form.sku,
            description: form.description,
            price: Number(form.price),
            quantity: Number(form.quantity),
            unit: form.unit,
            currency: form.currency, // Payload'a yeni alanı ekle
        };
        try {
            if (initialData && initialData.id) {
                await API.put(`/products/${initialData.id}`, payload);
            } else {
                await API.post('/products', payload);
            }
            onClose();
        } catch (error: any) {
            console.error("Ürün kaydedilirken hata oluştu:", error);
            setError(error.response.data.message)
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{initialData ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</DialogTitle>
            <DialogContent>
                <TextField label="Ürün Adı" name="name" fullWidth margin="dense" value={form.name} onChange={handleChange} required aria-required />
                <TextField label="Stok Kodu (SKU)" name="sku" fullWidth margin="dense" value={form.sku} onChange={handleChange} required />

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField label="Miktar" name="quantity" fullWidth margin="dense" type='number' value={form.quantity} onChange={handleChange} required InputProps={{ inputProps: { min: 0 } }} />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Birim</InputLabel>
                        <Select name="unit" value={form.unit} label="Birim" onChange={handleSelectChange}>
                            {Object.keys(ProductUnit).map((u) => <MenuItem key={u} value={u}>{u}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>

                {/* Fiyat ve Para Birimi yan yana */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField label="Fiyat" name="price" fullWidth margin="dense" type='number' value={form.price} onChange={handleChange} required InputProps={{ inputProps: { min: 0 } }} />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Para Birimi</InputLabel>
                        <Select name="currency" value={form.currency} label="Para Birimi" onChange={handleSelectChange}>
                            {Object.keys(Currency).map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>

                <TextField label="Açıklama" name="description" fullWidth margin="dense" multiline rows={3} value={form.description} onChange={handleChange} />
                {error ? <h2 style={{ color: 'red' }}>{error}</h2> : <></>}
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px' }}>
                <Button onClick={onClose}>İptal</Button>
                <Button variant="contained" onClick={handleSubmit}>Kaydet</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductFormDialog;
