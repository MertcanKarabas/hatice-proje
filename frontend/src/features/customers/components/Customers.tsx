import React, { useEffect, useState } from 'react';
import { getCustomers } from '../services/customerService';
import axiosClient from '../../../services/axiosClient';
import {
    Container,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import type { Customer } from '../../../types';
import AddCustomerModal from './AddCustomerModal';
import { useNavigate } from 'react-router-dom';
import { deleteCustomer } from '../services/customerService';

const Customers: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
    const navigate = useNavigate();

    const fetchCustomers = async () => {
        try {
            const response = await getCustomers(axiosClient);
            setCustomers(response);
        } catch (error) {
            console.error('Müşteriler getirilirken hata oluştu:', error);
        }
    };

    useEffect(() => {
        void fetchCustomers();
    }, []);

    const handleCustomerAdded = (newCustomer: Customer) => {
        setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
    };

    const handleDeleteClick = (customer: Customer) => {
        setCustomerToDelete(customer);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (customerToDelete) {
            try {
                await deleteCustomer(axiosClient, customerToDelete.id);
                setCustomers((prevCustomers) =>
                    prevCustomers.filter((c) => c.id !== customerToDelete.id)
                );
                setOpenDeleteDialog(false);
                setCustomerToDelete(null);
            } catch (error) {
                console.error('Müşteri silinirken hata oluştu:', error);
            }
        }
    };

    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
        setCustomerToDelete(null);
    };

    const handleViewTransactions = (customerId: string) => {
        void navigate(`/customers/${customerId}/transactions`);
    };

    const handlePaymentCollection = (customerId: string) => {
        void navigate(`/customers/${customerId}/payment-collection`);
    };

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" component="h2" gutterBottom>
                Müşteriler
            </Typography>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsModalOpen(true)}
                sx={{ mb: 2 }}
            >
                Yeni Müşteri Ekle
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ticari Ünvan</TableCell>
                            <TableCell>Telefon</TableCell>
                            <TableCell>Adres</TableCell>
                            <TableCell>Vergi Dairesi</TableCell>
                            <TableCell>Vergi No</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Tip</TableCell>
                            <TableCell>Bakiye</TableCell>
                            <TableCell>İşlemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customers.map((customer) => (
                            <TableRow key={customer.id}>
                                <TableCell>{customer.commercialTitle}</TableCell>
                                <TableCell>{customer.phone}</TableCell>
                                <TableCell>{customer.address}</TableCell>
                                <TableCell>{customer.taxOffice}</TableCell>
                                <TableCell>{customer.taxNumber}</TableCell>
                                <TableCell>{customer.email}</TableCell>
                                <TableCell>{customer.type}</TableCell>
                                <TableCell>{customer.balance}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleViewTransactions(customer.id)}>
                                        <VisibilityIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteClick(customer)}>
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handlePaymentCollection(customer.id)}>
                                        <AttachMoneyIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <AddCustomerModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCustomerAdded={handleCustomerAdded}
            />

            <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
                <DialogTitle>Müşteriyi Sil</DialogTitle>
                <DialogContent>
                    <Typography>Müşteriyi silmek istediğinizden emin misiniz: {customerToDelete?.commercialTitle}?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>İptal</Button>
                    <Button onClick={handleConfirmDelete} color="error">Sil</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};
export default Customers;
