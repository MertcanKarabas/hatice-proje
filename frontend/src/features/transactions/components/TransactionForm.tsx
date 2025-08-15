import { Box, Button, Divider, MenuItem, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { tr } from 'date-fns/locale';
import { useForm, Controller } from 'react-hook-form';
import { getCustomers } from '../../customers/services/customerService';
import axiosClient from '../../../services/axiosClient';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setTransactionInfo } from '../../../store/transactionSlice';
import type { Customer, Transaction } from '../../../types';
import CustomerFormModal from '../../customers/components/CustomerFormModal';

type FormValues = Omit<Transaction, 'invoiceDate' | 'dueDate'> & {
    invoiceDate: Date;
    dueDate: Date;
};

export default function TransactionForm() {
    const { control, handleSubmit, register, setValue } = useForm<FormValues>({
        defaultValues: {
            customerId: '',
            invoiceDate: new Date(),
            dueDate: new Date(),
            vatRate: 0,
            currency: 'TRY',
            type: 'SALE',
            items: [],
        },
    });

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await getCustomers(axiosClient);
                setCustomers(response);
            } catch (error) {
                console.error('Müşteriler getirilirken hata oluştu:', error);
            }
        };
        void fetchCustomers();
    }, []);

    const handleCustomerAdded = (newCustomer: Customer) => {
        setCustomers(prev => [...prev, newCustomer].sort((a, b) => a.commercialTitle.localeCompare(b.commercialTitle)));
        setValue('customerId', newCustomer.id);
    };

    const onSubmit = (data: FormValues) => {
        dispatch(setTransactionInfo({ ...data, invoiceDate: data.invoiceDate.toISOString(), dueDate: data.dueDate.toISOString() }));
        void navigate('/transactions/select-products');
    };

    return (
        <Box p={3}>
            <Typography fontSize={{ xs: 20, sm: 30 }} variant="h5" mb={2}>
                Sipraiş Teklif Formu
            </Typography>
            <form onSubmit={(e) => {
                void handleSubmit(onSubmit)(e);
            }}>
                <Grid container spacing={5} >
                    <Grid size={{ xs: 12, sm: 20 }} component="div">
                        <TextField
                            required
                            select
                            fullWidth
                            size='small'
                            label="Kayıtlı Müşteri"
                            {...register('customerId')}
                        >
                            <MenuItem value="">Seçiniz</MenuItem>
                            {customers.map((customer) => (
                                <MenuItem key={customer.id} value={customer.id}>
                                    {customer.commercialTitle}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 20 }} sx={{ display: 'flex', alignItems: 'center' }} component="div">
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => setModalOpen(true)}
                        >
                            Yeni Müşteri Ekle
                        </Button>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 20 }} component="div">
                        <Divider />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 20 }} component="div">
                        <Controller
                            name="invoiceDate"
                            control={control}
                            render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
                                    <DateTimePicker
                                        sx={{ width: '100%'}}
                                        label="Fatura Tarihi ve Saati"
                                        {...field}
                                    />
                                </LocalizationProvider>
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 20 }} component="div">
                        <Controller
                            name="dueDate"
                            control={control}
                            render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
                                    <DateTimePicker
                                        sx={{ width: '100%'}}
                                        label="Vade Tarihi ve Saati"
                                        {...field}
                                    />
                                </LocalizationProvider>
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 20 }} component="div">
                        <TextField
                            fullWidth
                            type="number"
                            size='small'
                            label="KDV Oranı (%)"
                            {...register('vatRate')}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 20 }} component="div">
                        <Controller
                            name="currency"
                            control={control}
                            render={({ field }) => (
                                <TextField select fullWidth size="small" label="Döviz Birimi" {...field}>
                                    <MenuItem value="TRY">₺ Türk Lirası</MenuItem>
                                    <MenuItem value="USD">$ Amerikan Doları</MenuItem>
                                    <MenuItem value="EUR">€ Euro</MenuItem>
                                </TextField>
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 20 }} component="div">
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <TextField select fullWidth size="small" label="İşlem Türü" {...field}>
                                    <MenuItem value="SALE">Satış</MenuItem>
                                    <MenuItem value="PURCHASE">Alış</MenuItem>
                                </TextField>
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 20 }} component="div">

                    </Grid>
                </Grid>
                <Button type="submit" variant="contained">
                    İleri
                </Button>
            </form>
            <CustomerFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onCustomerAdded={handleCustomerAdded}
            />
        </Box>
    );
}
