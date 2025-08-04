import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCustomerTransactions } from '../services/customerService';
import axiosClient from '../../../services/axiosClient';
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
} from '@mui/material';
import type { Transaction } from '../../../types';

const CustomerTransactions: React.FC = () => {
    const { customerId } = useParams<{ customerId: string }>();
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        if (customerId) {
            const fetchTransactions = async () => {
                try {
                    const response = await getCustomerTransactions(axiosClient, customerId);
                    setTransactions(response);
                } catch (error) {
                    console.error('Müşteri işlemleri getirilirken hata oluştu:', error);
                }
            };
            void fetchTransactions();
        }
    }, [customerId]);

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" component="h2" gutterBottom>
                Müşteri İşlemleri: {customerId}
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>İşlem Tipi</TableCell>
                            <TableCell>Toplam Tutar</TableCell>
                            <TableCell>İndirim Tutarı</TableCell>
                            <TableCell>Son Tutar</TableCell>
                            <TableCell>Tarih</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>{transaction.transactionType}</TableCell>
                                <TableCell>{transaction.totalAmount}</TableCell>
                                <TableCell>{transaction.discountAmount}</TableCell>
                                <TableCell>{transaction.finalAmount}</TableCell>
                                <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default CustomerTransactions;