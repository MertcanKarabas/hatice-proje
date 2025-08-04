import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../store/store';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getCustomers } from '../../customers/services/customerService';
import axiosClient from '../../../services/axiosClient';
import type { Customer } from '../../../types';
import { createTransaction } from '../services/transactionService';
import { resetTransaction } from '../../../store/transactionSlice';
import { useNavigate } from 'react-router-dom';

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
    const grandTotal = transactionInfo.items?.reduce((acc, item) => acc + item.total, 0) ?? 0;

    const generatePdf = () => {
        const doc = new jsPDF();
        doc.text("Sipariş Özeti", 14, 16);

        const tableColumn = ["Ürün Adı", "Miktar", "Birim", "Birim Fiyat", "KDV Oranı", "KDV Tutarı", "Toplam"];
        const tableRows: any[] = [];

        transactionInfo.items?.forEach(item => {
            const product = transactionInfo.products?.find(p => p.id === item.productId);
            const vatAmount = Number(item.price) * item.quantity * item.vatRate / 100;
            const itemData = [
                product?.name ?? 'N/A',
                item.quantity,
                item.unit,
                Number(item.price).toFixed(2),
                `%${item.vatRate}`,
                vatAmount.toFixed(2),
                item.total.toFixed(2),
            ];
            tableRows.push(itemData);
        });

        (doc as any).autoTable(tableColumn, tableRows, {
            startY: 20,
            headStyles: { fillColor: [100, 100, 100] },
            footStyles: { fillColor: [100, 100, 100] },
            bodyStyles: { fillColor: [240, 240, 240] },
            alternateRowStyles: { fillColor: [255, 255, 255] },
        });

        const finalY = (doc as any).autoTable.previous.finalY;
        doc.text(`Müşteri: ${customer?.commercialTitle || 'N/A'}`, 14, finalY + 10);
        doc.text(`Fatura Tarihi: ${new Date(transactionInfo.invoiceDate).toLocaleDateString()}`, 14, finalY + 20);
        doc.text(`Vade Tarihi: ${transactionInfo.dueDate ? new Date(transactionInfo.dueDate).toLocaleDateString() : 'N/A'}`, 14, finalY + 30);
        doc.text(`Toplam KDV: ${totalVat.toFixed(2)}`, 14, finalY + 40);
        doc.text(`Genel Toplam: ${grandTotal.toFixed(2)}`, 14, finalY + 50);

        doc.save('siparis_ozeti.pdf');
    };

    const handleSaveTransaction = async () => {
        const { customerId, transactionType, items, invoiceDate, dueDate, vatRate, currency, discountAmount } = transactionInfo;
        const transactionData = {
            customerId,
            type: transactionType,
            invoiceDate,
            dueDate,
            vatRate,
            currency,
            items: items?.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: Number(item.price),
                unit: item.unit,
                vatRate: item.vatRate,
            })) || [],
            totalAmount: grandTotal,
            discountAmount: discountAmount ?? 0,
            finalAmount: grandTotal - (discountAmount ?? 0),
        };

        try {
            await createTransaction(axiosClient, transactionData);
            generatePdf();
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
                            const vatAmount = Number(item.price) * item.quantity * item.vatRate / 100;
                            return (
                                <TableRow key={index}>
                                    <TableCell>{product?.name ?? 'N/A'}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{item.unit}</TableCell>
                                    <TableCell>{Number(item.price).toFixed(2)}</TableCell>
                                    <TableCell>{item.vatRate}%</TableCell>
                                    <TableCell>{vatAmount.toFixed(2)}</TableCell>
                                    <TableCell>{item.total.toFixed(2)}</TableCell>
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
                <Typography variant="h6">İşlem Türü: {transactionInfo.transactionType}</Typography>
            </Box>
            <Box mt={2} display="flex" justifyContent="flex-end">
                <Button variant="contained" onClick={() => { void handleSaveTransaction() }}>
                    {transactionInfo.transactionType === 'SALE' ? 'Satış' : 'Alış'}
                </Button>
            </Box>
        </Container>
    );
};

export default TransactionSummaryPage;
