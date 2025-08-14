import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    Button,
} from '@mui/material';
import type { Transaction } from '../../../types';
import { localizeTransactionType } from '../../transactions/services/localization.service';
import { getTransactions } from "../../transactions/services/transactionService"
import TransactionFilter from "../../transactions/components/TransactionFilter"

const CustomerTransactions: React.FC = () => {
    const { customerId } = useParams<{ customerId: string }>();
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
    const handleViewDetails = (id: string) => {
        void navigate(`/transactions/${id}`);
    };
    return (
        <Container maxWidth="xl">
            <Typography variant="h4" component="h2" gutterBottom>
                Müşteri İşlemleri: {customerId}
            </Typography>
            <TransactionFilter filter={filter} setFilter={setFilter} onApply={applyFilter} />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>İşlem Tipi</TableCell>
                            <TableCell>Toplam Tutar</TableCell>
                            <TableCell>İndirim Tutarı</TableCell>
                            <TableCell>Son Tutar</TableCell>
                            <TableCell>Tarih</TableCell>
                            <TableCell>Detaylar</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>{localizeTransactionType(transaction.type)}</TableCell>
                                <TableCell>{transaction.totalAmount}</TableCell>
                                <TableCell>{transaction.discountAmount}</TableCell>
                                <TableCell>{transaction.finalAmount}</TableCell>
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

export default CustomerTransactions;