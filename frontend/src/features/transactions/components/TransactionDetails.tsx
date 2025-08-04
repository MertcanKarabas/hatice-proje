import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Box
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { getTransactionById } from '../services/transactionService';
import axiosClient from '../../../services/axiosClient';
import type { Transaction } from '../../../types';

const TransactionDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactionDetails = async () => {
            if (!id) {
                setError("İşlem ID'si bulunamadı.");
                setLoading(false);
                return;
            }
            try {
                const response = await getTransactionById(axiosClient, id);
                setTransaction(response);
            } catch (err) {
                console.error('İşlem detayları getirilirken hata oluştu:', err);
                setError('İşlem detayları yüklenirken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };
        void fetchTransactionDetails();
    }, [id]);

    if (loading) {
        return (
            <Container maxWidth="md">
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md">
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    if (!transaction) {
        return (
            <Container maxWidth="md">
                <Typography>İşlem bulunamadı.</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" component="h2" gutterBottom>
                İşlem Detayları: {transaction.id}
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Genel Bilgiler</Typography>
                <Table size="small">
                    <TableBody>
                        <TableRow>
                            <TableCell component="th" scope="row">Müşteri ID:</TableCell>
                            <TableCell>{transaction.customerId}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">İşlem Tipi:</TableCell>
                            <TableCell>{transaction.transactionType}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">Toplam Tutar:</TableCell>
                            <TableCell>{Number(transaction.totalAmount).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">İndirim Tutarı:</TableCell>
                            <TableCell>{Number(transaction.discountAmount).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">Son Tutar:</TableCell>
                            <TableCell>{Number(transaction.finalAmount).toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">Oluşturulma Tarihi:</TableCell>
                            <TableCell>{new Date(transaction.createdAt).toLocaleString()}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">Güncelleme Tarihi:</TableCell>
                            <TableCell>{new Date(transaction.updatedAt).toLocaleString()}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>

            <Typography variant="h6" gutterBottom>Ürünler</Typography>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Ürün ID</TableCell>
                            <TableCell>Miktar</TableCell>
                            <TableCell>Birim Fiyat</TableCell>
                            <TableCell>KDV Oranı</TableCell>
                            <TableCell>Birim</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transaction.items.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.productId}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{Number(item.price).toFixed(2)}</TableCell>
                                <TableCell>{item.vatRate}%</TableCell>
                                <TableCell>{item.unit}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default TransactionDetails;