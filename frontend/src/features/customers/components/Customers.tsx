import React, { useState } from 'react';
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
import EditIcon from '@mui/icons-material/Edit';
import type { Customer } from '../../../types';
import CustomerFormModal from './CustomerFormModal';
import { useNavigate } from 'react-router-dom';
import { deleteCustomer } from '../services/customerService';
import CustomerFilter from './CustomerFilter';
import { useCustomers } from '../hooks/useCustomers';
import axiosClient from '../../../services/axiosClient';

const Customers: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
    const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
    const navigate = useNavigate();

    const {
        customers,
        filter,
        setFilter,
        fetchCustomers,
        handleCustomerSaved,
        handleCustomerDeleted,
    } = useCustomers({
        field: 'commercialTitle',
        operator: 'contains',
        value: '',
    });

    const handleAddClick = () => {
        setCustomerToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (customer: Customer) => {
        setCustomerToEdit(customer);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (customer: Customer) => {
        setCustomerToDelete(customer);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (customerToDelete) {
            try {
                await deleteCustomer(axiosClient, customerToDelete.id);
                handleCustomerDeleted(customerToDelete.id);
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
                onClick={handleAddClick} // Changed onClick
                sx={{ mb: 2 }}
            >
                Yeni Müşteri Ekle
            </Button>
            <CustomerFilter filter={filter} setFilter={setFilter} onApply={fetchCustomers} />
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
                            <TableCell>Döviz</TableCell>
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
                                <TableCell>{customer.balance < 0 ? `${Math.abs(customer.balance)} A` : `${customer.balance} B`}</TableCell>
                                <TableCell>{customer.exchange?.code}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleViewTransactions(customer.id)}>
                                        <VisibilityIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleEditClick(customer)}> {/* Added Edit button */}
                                        <EditIcon />
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

            <CustomerFormModal // Changed component name
                open={isModalOpen}
                onClose={() => { setIsModalOpen(false); setCustomerToEdit(null); }} // Clear customerToEdit on close
                onCustomerSaved={handleCustomerSaved} // Changed prop name
                initialData={customerToEdit} // Pass initialData
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