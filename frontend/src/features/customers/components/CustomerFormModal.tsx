import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Grid,
    MenuItem
} from '@mui/material';
import { createCustomer, updateCustomer } from '../services/customerService'; // Import updateCustomer
import { getCurrencies } from '../../currencies/services/currencyService';
import axiosClient from '../../../services/axiosClient';
import type { Customer, Exchange } from '../../../types';
import FeedbackAlert from '../../alerts/Alert';
import type { AxiosError } from 'axios';

type CustomerFormValues = Omit<Customer, 'id'>;

interface Props {
    open: boolean;
    onClose: () => void;
    onCustomerSaved: (customer: Customer) => void; // Changed prop name
    initialData: Customer | null; // Added initialData prop
}

const CustomerFormModal: React.FC<Props> = ({ open, onClose, onCustomerSaved, initialData }) => {
    const { register, handleSubmit, reset, setValue } = useForm<CustomerFormValues>(); // Added setValue
    const [error, setError] = useState<unknown>("");
    const [currencies, setCurrencies] = useState<Exchange[]>([]);

    useEffect(() => {
        if (open) {
            setError(null); // Clear error on open
            getCurrencies(axiosClient).then((data) => { setCurrencies(data); console.log("Currencies fetched:", data); }).catch(console.error);
            if (initialData) {
                console.log("initialData.exchange:", initialData.exchange);
                console.log("initialData.exchangeId:", initialData.exchangeId);
                // Populate form fields with initialData for editing
                setValue('commercialTitle', initialData.commercialTitle);
                setValue('phone', initialData.phone);
                setValue('address', initialData.address);
                setValue('balance', initialData.balance);
                setValue('type', initialData.type);
                setValue('taxOffice', initialData.taxOffice);
                setValue('taxNumber', initialData.taxNumber);
                setValue('email', initialData.email);
                setValue('exchangeId', initialData.exchangeId);
            } else {
                reset(); // Reset form for adding new customer
                if (currencies.length > 0) {
                    setValue('exchangeId', currencies[0].id);
                }
            }
        }
    }, [open, initialData, reset, setValue]);

    const onSubmit = async (data: CustomerFormValues) => {
        console.log("Form data:", data);
        try {
            let response: Customer;
            if (initialData) {
                // Update existing customer
                response = await updateCustomer(axiosClient, initialData.id, data);
            } else {
                // Create new customer
                response = await createCustomer(axiosClient, data);
            }
            onCustomerSaved(response); // Call the new prop
            reset();
            onClose();
        } catch (error: unknown) {
            console.log("Error:", error);
            const axiosError = error as AxiosError<{ message?: string[] }>;
            if (
                Array.isArray(axiosError?.response?.data?.message)
            ) {
                setError(axiosError.response.data.message[0]);
            } else {
                setError("Bilinmeyen bir hata oluştu.");
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{initialData ? 'Müşteriyi Düzenle' : 'Yeni Müşteri Ekle'}</DialogTitle> {/* Dynamic title */}
            <form onSubmit={(e) => {
                void handleSubmit(onSubmit)(e);
            }}>
                <DialogContent>
                    <Grid container spacing={2} sx={{ display: 'flex', flexDirection: 'column' }}>
                        {error ? <FeedbackAlert severity='error' text={String(error)} /> : <></>}
                        <Grid component="div">
                            <TextField required label="Ticari Ünvan" {...register('commercialTitle', { required: true })} fullWidth />
                        </Grid>
                        <Grid component="div">
                            <TextField required label="Telefon No" {...register('phone', { required: true })} fullWidth />
                        </Grid>
                        <Grid component="div">
                            <TextField required label="Adres" {...register('address', { required: true })} fullWidth />
                        </Grid>
                        <Grid component="div">
                            <TextField label="Bakiye" type="number" {...register('balance')} fullWidth />
                        </Grid>
                        <Grid component="div">
                            <TextField select label="Döviz" {...register('exchangeId')} fullWidth>
                                {currencies.map((currency) => (
                                    <MenuItem key={currency.id} value={currency.id}>
                                        {currency.code}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid component="div">
                            <TextField select label="Tipi" {...register('type')} fullWidth defaultValue="SALES">
                                <MenuItem value="SALES">Satış</MenuItem>
                                <MenuItem value="PURCHASE">Alış</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid component="div">
                            <TextField label="Vergi Dairesi" {...register('taxOffice')} fullWidth />
                        </Grid>
                        <Grid component="div">
                            <TextField label="Vergi No" {...register('taxNumber')} fullWidth />
                        </Grid>
                        <Grid component="div">
                            <TextField label="Email" type="email" {...register('email')} fullWidth />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>İptal</Button>
                    <Button type="submit" variant="contained">Kaydet</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default CustomerFormModal;