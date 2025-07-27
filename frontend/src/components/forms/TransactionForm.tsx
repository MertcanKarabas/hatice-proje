import {
    Box,
    Button,
    Divider,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { tr } from 'date-fns/locale';
import { useForm, Controller } from 'react-hook-form';
import AddCustomerModal from '../AddCustomerModal'; // Import edin
import API from '../../services/api'; // Import edin
import { useEffect, useState } from 'react';

type FormValues = {
    customerId: string;
    invoiceDate: Date;
    dueDate: Date;
    vatRate: number;
    currency: string;
    transactionType: 'SALE' | 'PURCHASE';
};

interface Customer {
    id: string;
    commercialTitle: string;
}

const mockUsers = [
    { id: '1', name: 'Ahmet Yılmaz' },
    { id: '2', name: 'Beta Elektrik Ltd.' },
];

export default function TransactionForm() {
    const { control, handleSubmit, register, setValue } = useForm<FormValues>({
        defaultValues: {
            customerId: '',
            invoiceDate: new Date(),
            dueDate: new Date(),
            vatRate: 20,
            currency: 'TRY',
            transactionType: 'SALE',
        },
    });

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await API.get('/customers');
                setCustomers(response.data);
            } catch (error) {
                console.error('Müşteriler getirilirken hata oluştu:', error);
            }
        };
        fetchCustomers();
    }, []);

    const handleCustomerAdded = (newCustomer: Customer) => {
        setCustomers(prev => [...prev, newCustomer].sort((a, b) => a.commercialTitle.localeCompare(b.commercialTitle)));
        setValue('customerId', newCustomer.id);
    };

    const onSubmit = (data: FormValues) => {
        console.log('Form submitted:', data);
    };

    const hasUsers = mockUsers.length > 0;

    return (
        <Box p={3}>
            <Typography variant="h5" mb={2}>
                Yeni İşlem (Alış / Satış)
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={5} >
                    <Grid item xs={12} sm={6} size={20}>
                        <TextField
                            select
                            fullWidth
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
                    <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => setModalOpen(true)}
                        >
                            Yeni Müşteri Ekle
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} size={20}>
                        <Divider />
                    </Grid>

                    <Grid item xs={12} sm={6} size={20}>
                        <Controller
                            name="invoiceDate"
                            control={control}
                            render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
                                    <DateTimePicker
                                        label="Fatura Tarihi ve Saati"
                                        {...field}
                                        renderInput={(params) => (
                                            <TextField fullWidth size="medium" {...params} />
                                        )}
                                    />
                                </LocalizationProvider>
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} size={20}>
                        <Controller

                            name="dueDate"
                            control={control}
                            render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={tr}>
                                    <DateTimePicker
                                        label="Vade Tarihi ve Saati"
                                        {...field}
                                        renderInput={(params) => (
                                            <TextField fullWidth size="medium" {...params} />
                                        )}
                                    />
                                </LocalizationProvider>
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4} size={20}>
                        <TextField
                            fullWidth
                            type="number"
                            size="medium"
                            label="KDV Oranı (%)"
                            {...register('vatRate')}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4} size={20}>
                        <TextField
                            select
                            fullWidth
                            size="medium"
                            label="Döviz Birimi"
                            {...register('currency')}
                        >
                            <MenuItem value="TRY">₺ Türk Lirası</MenuItem>
                            <MenuItem value="USD">$ Amerikan Doları</MenuItem>
                            <MenuItem value="EUR">€ Euro</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={4} size={20}>
                        <TextField
                            select
                            fullWidth
                            size="medium"
                            label="İşlem Türü"
                            {...register('transactionType')}
                        >
                            <MenuItem value="SALE">Satış</MenuItem>
                            <MenuItem value="PURCHASE">Alış</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} size={20}>

                    </Grid>
                </Grid>
                <Button type="submit" variant="contained">
                    Kaydet
                </Button>
            </form>
            <AddCustomerModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onCustomerAdded={handleCustomerAdded}
            />
        </Box>
    );
}
