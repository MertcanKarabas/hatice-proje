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
    Box,
    Button
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { getTransactionById } from '../services/transactionService';
import axiosClient from '../../../services/axiosClient';
import type { Transaction } from '../../../types';
import { localizeTransactionType } from '../services/localization.service';
import { generateTransactionSummaryPdf } from '../../../utils/transactionSummaryPdfGenerator';

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
                console.log('TransactionDetails - Fetched transaction:', response);
            } catch (err) {
                console.error('İşlem detayları getirilirken hata oluştu:', err);
                setError('İşlem detayları yüklenirken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };
        void fetchTransactionDetails();
    }, [id]);

    const generatePdf = async () => {
        if (!transaction || !transaction.customer) return;

        const itemsWithCalculatedTotal = transaction.items.map(item => {
            const productTotalPrice = Number(item.price) * item.quantity;
            const vatAmount = productTotalPrice * (item.vatRate / 100);
            return {
                ...item,
                total: productTotalPrice + vatAmount,
            };
        });

        const totalVat = itemsWithCalculatedTotal.reduce((acc, item) => {
            const productTotalPrice = Number(item.price) * item.quantity;
            return acc + (productTotalPrice * (item.vatRate / 100));
        }, 0);
        const grandTotal = itemsWithCalculatedTotal.reduce((acc, item) => acc + item.total, 0);
        const products = transaction.items.map(p => p.product);

        const dateToUse = (transaction.type === 'COLLECTION' || transaction.type === 'PAYMENT')
            ? transaction.createdAt
            : transaction.invoiceDate;

        await generateTransactionSummaryPdf({
            type: transaction.type,
            items: itemsWithCalculatedTotal,
            products,
            customerCommercialTitle: transaction.customer?.commercialTitle,
            invoiceDate: dateToUse,
            dueDate: transaction.dueDate,
            totalVat,
            grandTotal,
            customerPreviousBalance: transaction.customerPreviousBalance,
            customerNewBalance: transaction.customerNewBalance,
            transactionCurrencyCode: transaction.exchange?.code, // Pass transaction currency code
        });
    };

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
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" component="h2" gutterBottom>
                    İşlem Detayları: {transaction.id}
                </Typography>
                <Button variant="contained" onClick={generatePdf}>
                    PDF İndir
                </Button>
            </Box>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Genel Bilgiler</Typography>
                <Table size="small">
                    <TableBody>
                        <TableRow>
                            <TableCell component="th" scope="row">Müşteri Ünvanı:</TableCell>
                            <TableCell>{transaction.customer?.commercialTitle ?? transaction.customerId}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">İşlem Tipi:</TableCell>
                            <TableCell>{localizeTransactionType(transaction.type)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">Toplam Tutar:</TableCell>
                            <TableCell>{Number(transaction.totalAmount).toFixed(2)} {transaction.exchange?.code || 'TRY'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">İndirim Tutarı:</TableCell>
                            <TableCell>{Number(transaction.discountAmount).toFixed(2)} {transaction.exchange?.code || 'TRY'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">Son Tutar:</TableCell>
                            <TableCell>{Number(transaction.finalAmount).toFixed(2)} {transaction.exchange?.code || 'TRY'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">Oluşturulma Tarihi:</TableCell>
                            <TableCell>{new Date(transaction.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit' })}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">Güncelleme Tarihi:</TableCell>
                            <TableCell>{new Date(transaction.updatedAt).toLocaleDateString('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit' })}</TableCell>
                        </TableRow>
                        {transaction.customerPreviousBalance !== undefined && transaction.customerNewBalance !== undefined && (
                            <>
                                <TableRow>
                                    <TableCell component="th" scope="row">Müşteri Önceki Bakiye:</TableCell>
                                    <TableCell>{Number(transaction.customerPreviousBalance).toFixed(2)} {transaction.customer?.exchange?.code || 'TL'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">Müşteri Yeni Bakiye:</TableCell>
                                    <TableCell>{Number(transaction.customerNewBalance).toFixed(2)} {transaction.customer?.exchange?.code || 'TL'}</TableCell>
                                </TableRow>
                            </>
                        )}
                        {transaction.exchange && (
                            <TableRow>
                                <TableCell component="th" scope="row">İşlem Para Birimi:</TableCell>
                                <TableCell>{transaction.exchange.code}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Paper>

            <Typography variant="h6" gutterBottom>Ürünler</Typography>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Ürün Adı</TableCell>
                            <TableCell>Miktar</TableCell>
                            <TableCell>Birim Fiyat</TableCell>
                            <TableCell>KDV Oranı</TableCell>
                            <TableCell>Birim</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transaction.items.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.product.name}</TableCell>
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