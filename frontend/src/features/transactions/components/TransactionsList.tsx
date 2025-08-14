import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getTransactions } from '../services/transactionService';
import axiosClient from '../../../services/axiosClient';
import type { Transaction } from '../../../types';
import { localizeTransactionType } from '../services/localization.service';
import TransactionFilter from './TransactionFilter';

const TransactionsList: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filter, setFilter] = useState<{ field: string; operator: string; value: string }>({ 
        field: 'customer.commercialTitle',
        operator: 'contains',
        value: '',
    });
    const navigate = useNavigate();

    const applyFilter = async () => {
        console.log('Applying filter with state:', filter);
        const response = await getTransactions(axiosClient, filter);
        setTransactions(response);
    };

    useEffect(() => {
        void applyFilter();
    }, []);

    const handleViewDetails = (id: string) => {
        void navigate(`/transactions/${id}`);
    };

    const handleNewTransaction = () => {
        void navigate('/transactions/new');
    };

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" component="h2" gutterBottom>
                Tüm İşlemler
            </Typography>
            <Box sx={{ mb: 2 }}>
                <Button variant="contained" onClick={handleNewTransaction}>
                    Yeni İşlem
                </Button>
            </Box>
            <TransactionFilter filter={filter} setFilter={setFilter} onApply={applyFilter} />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Müşteri ID</TableCell>
                            <TableCell>İşlem Tipi</TableCell>
                            <TableCell>Toplam Tutar</TableCell>
                            <TableCell>Son Tutar</TableCell>
                            <TableCell>Tarih</TableCell>
                            <TableCell>İşlemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>{transaction.id}</TableCell>
                                <TableCell>{transaction.customer?.commercialTitle ?? transaction.customerId}</TableCell>
                                <TableCell>{localizeTransactionType(transaction.type)}</TableCell>
                                <TableCell>{Number(transaction.totalAmount).toFixed(2)}</TableCell>
                                <TableCell>{Number(transaction.finalAmount).toFixed(2)}</TableCell>
                                <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" size="small" onClick={() => handleViewDetails(transaction.id)}>
                                        Detayları Görüntüle
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default TransactionsList;