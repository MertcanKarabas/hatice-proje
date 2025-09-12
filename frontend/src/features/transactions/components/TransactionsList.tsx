import React, { useState } from 'react';
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

import { localizeTransactionType } from '../services/localization.service';
import TransactionFilter from './TransactionFilter';
import { useTransactions } from '../hooks/useTransactions';
import { deleteTransaction } from '../services/transactionService';
import axiosClient from '../../../services/axiosClient';

interface FilterState {
    field: string;
    operator: string;
    value: string;
    endValue?: string;
}

const TransactionsList: React.FC = () => {
    const [filter, setFilter] = useState<FilterState>({
        field: 'customer.commercialTitle',
        operator: 'contains',
        value: '',
    });
    const { transactions, fetchTransactions } = useTransactions(filter);
    const navigate = useNavigate();

    const handleViewDetails = (id: string) => {
        void navigate(`/transactions/${id}`);
    };

    const handleNewTransaction = () => {
        void navigate('/transactions/new');
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bu işlemi silmek istediğinizden emin misiniz?')) {
            try {
                await deleteTransaction(axiosClient, id);
                fetchTransactions(); // Refresh the list
            } catch (error) {
                console.error('İşlem silinirken hata oluştu:', error);
                alert('İşlem silinirken bir hata oluştu.');
            }
        }
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
            <TransactionFilter filter={filter} setFilter={setFilter} onApply={fetchTransactions} />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Müşteri Ünvanı</TableCell>
                            <TableCell>İşlem Tipi</TableCell>
                            <TableCell>Toplam Tutar</TableCell>
                            <TableCell>Son Tutar</TableCell>
                            <TableCell>Para Birimi</TableCell>
                            <TableCell>Kar</TableCell>
                            <TableCell>Tarih</TableCell>
                            <TableCell>İşlemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>{transaction.customer?.commercialTitle ?? transaction.customerId}</TableCell>
                                <TableCell>{localizeTransactionType(transaction.type)}</TableCell>
                                <TableCell>{Number(transaction.totalAmount).toFixed(2)}</TableCell>
                                <TableCell>{Number(transaction.finalAmount).toFixed(2)}</TableCell>
                                <TableCell>{transaction.exchange?.code}</TableCell>
                                <TableCell>{transaction.type === 'SALE' ? Number(transaction.profit ?? 0).toFixed(2) : '-'}</TableCell>
                                <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" size="small" onClick={() => handleViewDetails(transaction.id)}>
                                        Detayları Görüntüle
                                    </Button>
                                    <Button variant="outlined" size="small" color="error" sx={{ ml: 1 }} onClick={() => { void handleDelete(transaction.id); }}>
                                        Sil
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