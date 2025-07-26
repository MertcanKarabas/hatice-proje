import {
    Box,
    Button,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { tr } from 'date-fns/locale';
import { useForm, Controller } from 'react-hook-form';

type FormValues = {
    companyName: string;
    userId: string;
    invoiceDate: Date;
    dueDate: Date;
    vatRate: number;
    currency: string;
    transactionType: 'SALE' | 'PURCHASE';
};

const mockUsers = [
    { id: '1', name: 'Ahmet Yılmaz' },
    { id: '2', name: 'Beta Elektrik Ltd.' },
];

export default function TransactionForm() {
    const { control, handleSubmit, register } = useForm<FormValues>({
        defaultValues: {
            companyName: '',
            userId: '',
            invoiceDate: new Date(),
            dueDate: new Date(),
            vatRate: 20,
            currency: 'TRY',
            transactionType: 'SALE',
        },
    });

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
                            fullWidth
                            size="medium"
                            label="Ticari Ünvan"
                            {...register('companyName')}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} size={20}>
                        <TextField
                            fullWidth
                            select
                            size='medium'

                            label="Kayıtlı Kullanıcı (Varsa)"
                            {...register('userId')}
                            disabled={!hasUsers}
                        >
                            <MenuItem value="">Seçiniz</MenuItem>
                            {mockUsers.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.name}
                                </MenuItem>
                            ))}
                        </TextField>
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
        </Box>
    );
}
