import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import {
    Container,
    Typography,
    TextField,
    Button,
    MenuItem,
    Grid,
    Box
} from '@mui/material';
import { getCustomers } from '../services/customerService';
import axiosClient from '../../../services/axiosClient';
import type { Customer, CreatePaymentCollectionDtoFrontend } from '../../../types';
import { createPaymentCollection } from '../services/customerService';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { tr } from 'date-fns/locale';

const CustomerPaymentCollection: React.FC = () => {
    const { customerId } = useParams<{ customerId: string }>();
    const navigate = useNavigate();
    const { control, register, handleSubmit, setValue, formState: { errors } } = useForm<CreatePaymentCollectionDtoFrontend>();
    const [customer, setCustomer] = useState<Customer | null>(null);

    useEffect(() => {
        const fetchCustomer = async () => {
            if (customerId) {
                try {
                    const customers = await getCustomers(axiosClient);
                    const foundCustomer = customers.find(c => c.id === customerId);
                    setCustomer(foundCustomer ?? null);
                    if (foundCustomer) {
                        setValue('customerId', foundCustomer.id);
                        setValue('date', new Date().toISOString());
                    }
                } catch (error) {
                    console.error('Müşteri bilgileri getirilirken hata oluştu:', error);
                }
            }
        };
        void fetchCustomer();
    }, [customerId, setValue]);

    const onSubmit = async (data: CreatePaymentCollectionDtoFrontend) => {
        try {
            await createPaymentCollection(axiosClient, data);
            await navigate(`/customers/${customerId}/transactions`); // Navigate back to customer transactions or customers list
        } catch (error) {
            console.error('İşlem kaydedilirken hata oluştu:', error);
        }
    };

    if (!customer) {
        return <Typography>Müşteri bulunamadı veya yükleniyor...</Typography>;
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h2" gutterBottom>
                {customer.commercialTitle} için Tediye/Tahsilat İşlemi
            </Typography>
            <Box component="form" onSubmit={(e) => { void handleSubmit(onSubmit)(e); }} sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 20 }} component="div">
                        <TextField
                            fullWidth
                            label="İşlem Tipi"
                            select
                            {...register('type', { required: 'İşlem tipi zorunludur' })}
                            defaultValue="COLLECTION"
                            error={!!errors.type}
                            helperText={errors.type?.message}
                        >
                            <MenuItem value="COLLECTION">Tahsilat</MenuItem>
                            <MenuItem value="PAYMENT">Tediye</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 20 }} component="div">
                        <TextField
                            fullWidth
                            label="Miktar"
                            type="number"
                            {...register('amount', { required: 'Miktar zorunludur', valueAsNumber: true, min: { value: 0.01, message: "Miktar 0'dan büyük olmalıdır" } })}
                            error={!!errors.amount}
                            helperText={errors.amount?.message}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 20 }} component="div">
                        <Controller
                            name="date"
                            control={control}
                            render={({ field: { onChange, value, ...restField } }) => (
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
                                    <DateTimePicker
                                        sx={{ width: '100%' }}
                                        label="Tediye/Tahsilat Tarihi"
                                        value={value ? new Date(value) : null}
                                        onChange={(date) => onChange(date)}
                                        {...restField}
                                    />
                                </LocalizationProvider>
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 20 }} component="div">
                        <TextField
                            fullWidth
                            label="Açıklama (Opsiyonel)"
                            multiline
                            rows={4}
                            {...register('description')}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 20 }} component="div">
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Kaydet
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default CustomerPaymentCollection;