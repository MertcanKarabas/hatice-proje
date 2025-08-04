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

const TransactionsList: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await getTransactions(axiosClient);
                setTransactions(response);
            } catch (error) {
                console.error('İşlemler getirilirken hata oluştu:', error);
            }
        };
        void fetchTransactions();
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
                                <TableCell>{transaction.customerId}</TableCell>
                                <TableCell>{transaction.transactionType}</TableCell>
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