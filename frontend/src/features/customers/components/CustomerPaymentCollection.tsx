import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import type { CreatePaymentCollectionDtoFrontend, Exchange } from '../../../types';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { tr } from 'date-fns/locale';
import { useCustomerPaymentCollection } from '../hooks/useCustomerPaymentCollection';
import { getCurrencies } from '../../currencies/services/currencyService';
import axiosClient from '../../../services/axiosClient';

const CustomerPaymentCollection: React.FC = () => {
    const { customerId } = useParams<{ customerId: string }>();
    const { control, register, handleSubmit, setValue, formState: { errors } } = useForm<CreatePaymentCollectionDtoFrontend>();
    const { customer, loading, error, handleSubmit: handleHookSubmit } = useCustomerPaymentCollection(customerId);
    const [currencies, setCurrencies] = useState<Exchange[]>([]);

    useEffect(() => {
        getCurrencies(axiosClient).then((data) => {
            setCurrencies(data);
            if (data.length > 0) {
                setValue('exchangeId', data[0].code); // Set default transaction currency to code
            }
        }).catch(console.error);

        if (customer) {
            setValue('customerId', customer.id);
            setValue('date', new Date().toISOString());
        }
    }, [customer, setValue]);

    if (loading) {
        return <Typography>Yükleniyor...</Typography>;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    if (!customer) {
        return <Typography>Müşteri bulunamadı.</Typography>;
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h2" gutterBottom>
                {customer.commercialTitle} için Tediye/Tahsilat İşlemi
            </Typography>
            <Box component="form" onSubmit={(e) => { void handleSubmit(handleHookSubmit)(e); }} sx={{ mt: 3 }}>
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
                        <TextField select label="Para Birimi" {...register('exchangeId')} fullWidth>
                            {currencies.map((currency) => (
                                <MenuItem key={currency.id} value={currency.code}>
                                    {currency.code}
                                </MenuItem>
                            ))}
                        </TextField>
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