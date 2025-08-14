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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { localizeTransactionType } from '../services/localization.service';

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

    const generatePdf = () => {
        if (!transaction) return;

        const doc = new jsPDF();
        doc.text("Sipariş Özeti", 14, 16);

        const tableColumn = ["Ürün Adı", "Miktar", "Birim", "Birim Fiyat", "KDV Oranı", "KDV Tutarı", "Toplam"];
        const tableRows: any[] = [];

        const totalVat = transaction.items?.reduce((acc, item) => acc + (Number(item.price) * item.quantity * item.vatRate / 100), 0) ?? 0;

        transaction.items?.forEach(item => {
            const vatAmount = Number(item.price) * item.quantity * item.vatRate / 100;
            const total = (Number(item.price) * item.quantity) + vatAmount;
            const itemData = [
                item.product.name ?? 'N/A',
                item.quantity,
                item.unit,
                Number(item.price).toFixed(2),
                `%${item.vatRate}`,
                vatAmount.toFixed(2),
                total.toFixed(2),
            ];
            tableRows.push(itemData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            headStyles: { fillColor: [100, 100, 100] },
            footStyles: { fillColor: [100, 100, 100] },
            bodyStyles: { fillColor: [240, 240, 240] },
            alternateRowStyles: { fillColor: [255, 255, 255] },
        });

        const finalY = (doc as any).lastAutoTable.finalY;
        doc.text(`Müşteri: ${transaction.customer?.commercialTitle || 'N/A'}`, 14, finalY + 10);
        doc.text(`Fatura Tarihi: ${new Date(transaction.createdAt).toLocaleDateString()}`, 14, finalY + 20);
        doc.text(`Vade Tarihi: ${transaction.dueDate ? new Date(transaction.dueDate).toLocaleDateString() : 'N/A'}`, 14, finalY + 30);
        doc.text(`Toplam KDV: ${totalVat.toFixed(2)}`, 14, finalY + 40);
        doc.text(`Genel Toplam: ${Number(transaction.finalAmount).toFixed(2)}`, 14, finalY + 50);

        doc.save('siparis_ozeti.pdf');
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
                            <TableCell component="th" scope="row">Müşteri ID:</TableCell>
                            <TableCell>{transaction.customer?.commercialTitle ?? transaction.customerId}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">İşlem Tipi:</TableCell>
                            <TableCell>{localizeTransactionType(transaction.type)}</TableCell>
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
