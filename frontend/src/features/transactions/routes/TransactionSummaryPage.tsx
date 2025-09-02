import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../store/store';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box } from '@mui/material';
import { getCustomers } from '../../customers/services/customerService';
import axiosClient from '../../../services/axiosClient';
import type { Customer } from '../../../types';
import { createTransaction } from '../services/transactionService';
import { resetTransaction } from '../../../store/transactionSlice';
import { useNavigate } from 'react-router-dom';
import { localizeTransactionType } from '../services/localization.service';

const TransactionSummaryPage: React.FC = () => {
    const transactionInfo = useSelector((state: RootState) => state.transaction);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomer = async () => {
            if (transactionInfo.customerId) {
                const customers = await getCustomers(axiosClient);
                const currentCustomer = customers.find(c => c.id === transactionInfo.customerId);
                setCustomer(currentCustomer ?? null);
            }
        };
        void fetchCustomer();
    }, [transactionInfo.customerId]);

    const totalVat = transactionInfo.items?.reduce((acc, item) => acc + (Number(item.price) * item.quantity * item.vatRate / 100), 0) ?? 0;
    const grandTotal = transactionInfo.items?.reduce((acc, item) => acc + (item.total ?? 0), 0) ?? 0;

    const handleSaveTransaction = async () => {
        if (!customer) return;
        const { customerId, type, items, invoiceDate, dueDate, vatRate, exchangeId, discountAmount } = transactionInfo;
        
        const grandTotal = items?.reduce((acc, item) => acc + (item.total ?? 0), 0) ?? 0;

        const customerPreviousBalance = Number(customer.balance);
        let customerNewBalance = customerPreviousBalance;

        if (type === 'SALE' || type === 'COLLECTION') {
            customerNewBalance = customerPreviousBalance + Number(grandTotal);
        } else if (type === 'PURCHASE' || type === 'PAYMENT') {
            customerNewBalance = customerPreviousBalance - Number(grandTotal);
        }

        const transactionData = {
            customerId,
            type,
            invoiceDate,
            dueDate,
            vatRate: Number(vatRate),
            exchangeId, // Use exchangeId
            items: items?.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: Number(item.price),
                unit: item.unit,
                vatRate: Number(item.vatRate),
            })) || [],
            discountAmount: discountAmount ?? 0,
            customerPreviousBalance,
            customerNewBalance,
        };

        try {
            await createTransaction(axiosClient, transactionData);
            dispatch(resetTransaction());
            void navigate('/');
        } catch (error) {
            console.error('İşlem kaydedilirken hata oluştu:', error);
        }
    };

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" gutterBottom>Sipariş Özeti</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ürün Adı</TableCell>
                            <TableCell>Miktar</TableCell>
                            <TableCell>Birim</TableCell>
                            <TableCell>Birim Fiyat</TableCell>
                            <TableCell>KDV Oranı</TableCell>
                            <TableCell>KDV Tutarı</TableCell>
                            <TableCell>Toplam</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactionInfo.items?.map((item, index) => {
                            const product = transactionInfo.products?.find(p => p.id === item.productId);
                            const productTotalPrice = Number(item.price) * item.quantity;
                            const vatAmount = productTotalPrice * (item.vatRate / 100);
                            const total = productTotalPrice + vatAmount;
                            return (
                                <TableRow key={index}>
                                    <TableCell>{product?.name ?? 'N/A'}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{item.unit}</TableCell>
                                    <TableCell>{Number(item.price).toFixed(2)}</TableCell>
                                    <TableCell>{item.vatRate}%</TableCell>
                                    <TableCell>{vatAmount.toFixed(2)}</TableCell>
                                    <TableCell>{total.toFixed(2)}</TableCell>
                                </TableRow>
                            );
                        })}
                        <TableRow>
                            <TableCell align='right'><Typography fontWeight="bold">Toplam KDV: {totalVat.toFixed(2)}</Typography></TableCell>
                            <TableCell align='right'><Typography fontWeight="bold">Genel Toplam: {grandTotal.toFixed(2)}</Typography></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Box mt={2}>
                <Typography variant="h6">Müşteri: {customer?.commercialTitle ?? 'N/A'}</Typography>
                <Typography variant="h6">Fatura Tarihi: {new Date(transactionInfo.invoiceDate).toLocaleDateString()}</Typography>
                <Typography variant="h6">Vade Tarihi: {transactionInfo.dueDate ? new Date(transactionInfo.dueDate).toLocaleDateString() : 'N/A'}</Typography>
                <Typography variant="h6">İşlem Türü: {localizeTransactionType(transactionInfo.type)}</Typography>
            </Box>
            <Box mt={2} display="flex" justifyContent="flex-end">
                <Button variant="contained" onClick={() => { void handleSaveTransaction() }}>
                    {localizeTransactionType(transactionInfo.type)}
                </Button>
            </Box>
        </Container>
    );
};

export default TransactionSummaryPage;