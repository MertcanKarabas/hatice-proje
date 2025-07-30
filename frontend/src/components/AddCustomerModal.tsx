import React from 'react';
import { useForm } from 'react-hook-form';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Grid
} from '@mui/material';
// Remove this line, as Grid is already imported from '@mui/material' above
import API from '../services/api';

interface Props {
    open: boolean;
    onClose: () => void;
    onCustomerAdded: (customer: any) => void;
}

type CustomerFormValues = {
    commercialTitle: string;
    contactPerson: string;
    taxOffice: string;
    taxNumber: string;
    email: string;
    phone: string;
};

const AddCustomerModal: React.FC<Props> = ({ open, onClose, onCustomerAdded }) => {
    const { register, handleSubmit, reset } = useForm<CustomerFormValues>();

    const onSubmit = async (data: CustomerFormValues) => {
        try {
            const response = await API.post('/customers', data);
            onCustomerAdded(response.data);
            reset();
            onClose();
        } catch (error) {
            console.error("Error:", error);
            console.error('Müşteri eklenirken hata oluştu:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Yeni Müşteri Ekle</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField label="Ticari Ünvan" {...register('commercialTitle', { required: true })} fullWidth />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Yetkili" {...register('contactPerson', { required: true })} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Vergi Dairesi" {...register('taxOffice')} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Vergi No" {...register('taxNumber')} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Email" type="email" {...register('email')} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Telefon No" {...register('phone')} fullWidth />
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