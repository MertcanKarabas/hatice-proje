import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Grid,
    MenuItem
} from '@mui/material';
import { createCustomer } from '../services/customerService';
import axiosClient from '../../../services/axiosClient';
import type { Customer } from '../../../types';
import FeedbackAlert from '../../alerts/Alert';
import type { AxiosError } from 'axios';

type CustomerFormValues = Omit<Customer, 'id'>;


interface Props {
    open: boolean;
    onClose: () => void;
    onCustomerAdded: (customer: Customer) => void;
}


const AddCustomerModal: React.FC<Props> = ({ open, onClose, onCustomerAdded }) => {
    const { register, handleSubmit, reset } = useForm<CustomerFormValues>();
    const [error, setError] = useState<unknown>("");

    useEffect(() => {
        if (open) {
            reset();
        }
    }, [open, reset]);

    const onSubmit = async (data: CustomerFormValues) => {
        try {
            const response = await createCustomer(axiosClient, data);
            onCustomerAdded(response);
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
            <DialogTitle>Yeni Müşteri Ekle</DialogTitle>
            <form onSubmit={(e) => {
                void handleSubmit(onSubmit)(e);
            }}>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {error ? <FeedbackAlert severity='error' text={String(error)} /> : <></>}
                        <Grid size={{ xs: 6, sm: 12 }} component="div">
                            <TextField required label="Ticari Ünvan" {...register('commercialTitle', { required: true })} fullWidth />
                        </Grid>
                        <Grid size={{ xs: 6, sm: 12 }}>
                            <TextField required label="Telefon No" {...register('phone', { required: true })} fullWidth />
                        </Grid>
                        <Grid size={{ xs: 6, sm: 12 }}>
                            <TextField required label="Adres" {...register('address', { required: true })} fullWidth />
                        </Grid>
                        <Grid size={{ xs: 6, sm: 12 }}>
                            <TextField label="Vergi Dairesi" {...register('taxOffice')} fullWidth />
                        </Grid>
                        <Grid size={{ xs: 6, sm: 12 }}>
                            <TextField label="Vergi No" {...register('taxNumber')} fullWidth />
                        </Grid>
                        <Grid size={{ xs: 6, sm: 12 }}>
                            <TextField label="Email" type="email" {...register('email')} fullWidth />
                        </Grid>
                        <Grid size={{ xs: 6, sm: 12 }}>
                            <TextField select label="Tipi" {...register('type')} fullWidth defaultValue="SALES">
                                <MenuItem value="SALES">Satış</MenuItem>
                                <MenuItem value="PURCHASE">Alış</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 12 }}>
                            <TextField select label="Tipi" {...register('type')} fullWidth defaultValue="SALES">
                                <MenuItem value="SALES">Satış</MenuItem>
                                <MenuItem value="PURCHASE">Alış</MenuItem>
                            </TextField>
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

export default AddCustomerModal;