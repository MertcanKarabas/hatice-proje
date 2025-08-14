import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button,
    type SelectChangeEvent,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Typography,
    IconButton
} from '@mui/material';
import { createProduct, getProducts } from '../services/productService';
import axiosClient from '../../../services/axiosClient';
import type { Product } from '../../../types';
import { AxiosError } from 'axios';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

interface ProductData extends Omit<Product, 'id'> {
    id?: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onProductAdded: (product: Product) => void;
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
    quantity: string;
    unit: keyof typeof ProductUnit;
    currency: keyof typeof Currency;
    isPackage: boolean;
    components: { componentId: string; quantity: number }[];
}


const AddProductModal: React.FC<Props> = ({ open, onClose, onProductAdded }) => {
    const getInitialState = (): FormState => ({
        name: '', price: '', sku: '', description: '',
        quantity: '0', unit: 'ADET', currency: 'TRY',
        isPackage: false, components: [],
    });
    const [error, setError] = useState<string>("");
    const [form, setForm] = useState<FormState>(getInitialState());
    const [allExistingProducts, setAllExistingProducts] = useState<Product[]>([]); // Renamed to avoid conflict

    useEffect(() => {
        if (open) {
            const fetchExistingProducts = async () => {
                const res = await getProducts(axiosClient);
                setAllExistingProducts(res.data);
            };
            void fetchExistingProducts();
            setForm(getInitialState()); // Reset form when opened
        }
    }, [open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleComponentChange = (index: number, field: 'componentId' | 'quantity', value: string | number) => {
        const newComponents = [...form.components];
        newComponents[index] = { ...newComponents[index], [field]: value };
        setForm({ ...form, components: newComponents });
    };

    const addComponent = () => {
        setForm({ ...form, components: [...form.components, { componentId: '', quantity: 1 }] });
    };

    const removeComponent = (index: number) => {
        const newComponents = form.components.filter((_, i) => i !== index);
        setForm({ ...form, components: newComponents });
    };

    const handleSubmit = async () => {
        const payload = {
            ...form,
            price: Number(form.price),
            quantity: Number(form.quantity),
        };
        try {
            const newProduct = await createProduct(axiosClient, payload);
            onProductAdded(newProduct);
            onClose();
        } catch (error: unknown) {
            console.error("Ürün kaydedilirken hata oluştu:", error);

            const apiError = error as AxiosError<{ message: string }>;

            if (apiError.response?.data?.message) {
                setError(apiError.response.data.message);
            } else {
                setError("Bilinmeyen bir hata oluştu.");
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Yeni Ürün Ekle</DialogTitle>
            <DialogContent>
                <TextField label="Ürün Adı" name="name" fullWidth margin="dense" value={form.name} onChange={handleChange} required />
                <TextField label="Stok Kodu (SKU)" name="sku" fullWidth margin="dense" value={form.sku} onChange={handleChange} required />

                <FormControlLabel
                    control={<Checkbox checked={form.isPackage} onChange={handleChange} name="isPackage" />}
                    label="Paket Ürün"
                />

                {form.isPackage && (
                    <Box mt={2} p={2} border={1} borderColor="grey.300" borderRadius={1}>
                        <Typography variant="h6">Paket Bileşenleri</Typography>
                        {form.components.map((component, index) => (
                            <Box key={index} display="flex" gap={2} alignItems="center" mt={1}>
                                <FormControl fullWidth>
                                    <InputLabel>Ürün</InputLabel>
                                    <Select
                                        value={component.componentId}
                                        onChange={(e) => handleComponentChange(index, 'componentId', e.target.value)}
                                    >
                                        {allExistingProducts.map(p => (
                                            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Miktar"
                                    type="number"
                                    value={component.quantity}
                                    onChange={(e) => handleComponentChange(index, 'quantity', parseInt(e.target.value, 10) || 1)}
                                    InputProps={{ inputProps: { min: 1 } }}
                                />
                                <IconButton onClick={() => removeComponent(index)}>
                                    <RemoveCircleOutline />
                                </IconButton>
                            </Box>
                        ))}
                        <Button startIcon={<AddCircleOutline />} onClick={addComponent} sx={{ mt: 1 }}>
                            Bileşen Ekle
                        </Button>
                    </Box>
                )}

                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <TextField label="Miktar" name="quantity" fullWidth margin="dense" type='number' value={form.quantity} onChange={handleChange} required InputProps={{ inputProps: { min: 0 } }} />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Birim</InputLabel>
                        <Select name="unit" value={form.unit} label="Birim" onChange={handleSelectChange}>
                            {Object.keys(ProductUnit).map((u) => <MenuItem key={u} value={u}>{u}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>

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
                <Button variant="contained" onClick={() => { void handleSubmit(); }}>Kaydet</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddProductModal;
