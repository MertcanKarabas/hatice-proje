import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const TransactionSummaryPage: React.FC = () => {
    const transactionInfo = useSelector((state: RootState) => state.transaction);
    console.log("TransactionInfo:", transactionInfo);
    const generatePdf = () => {
        const doc = new jsPDF();
        doc.text("Sipariş Özeti", 14, 16);

        const tableColumn = ["Ürün Adı", "Miktar", "Birim", "Birim Fiyat", "KDV (%) ", "Toplam"];
        const tableRows: any = [];

        transactionInfo.items?.forEach(item => {
            const product = transactionInfo.products?.find(p => p.id === item.productId);
            const itemData = [
                product?.name || 'N/A',
                item.quantity,
                item.unit,
                item.price,
                item.vatRate,
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

        doc.text(`Müşteri ID: ${transactionInfo.customerId || 'N/A'}`, 14, (doc as any).autoTable.previous.finalY + 10);
        doc.text(`Fatura Tarihi: ${transactionInfo.invoiceDate?.toLocaleDateString() || 'N/A'}`, 14, (doc as any).autoTable.previous.finalY + 20);
        doc.text(`Vade Tarihi: ${transactionInfo.dueDate?.toLocaleDateString() || 'N/A'}`, 14, (doc as any).autoTable.previous.finalY + 30);
        doc.text(`KDV Oranı: %${transactionInfo.vatRate}`, 14, (doc as any).autoTable.previous.finalY + 40);
        doc.text(`Para Birimi: ${transactionInfo.currency}`, 14, (doc as any).autoTable.previous.finalY + 50);
        doc.text(`İşlem Türü: ${transactionInfo.transactionType}`, 14, (doc as any).autoTable.previous.finalY + 60);

        doc.save('siparis_ozeti.pdf');
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
                            <TableCell>KDV (%)</TableCell>
                            <TableCell>Toplam</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactionInfo.items?.map((item, index) => {
                            const product = transactionInfo.products?.find(p => p.id === item.productId);
                            return (
                                <TableRow key={index}>
                                    <TableCell>{product?.name || 'N/A'}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{item.unit}</TableCell>
                                    <TableCell>{item.price}</TableCell>
                                    <TableCell>{item.vatRate}</TableCell>
                                    <TableCell>{item.total.toFixed(2)}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box mt={2}>
                <Typography variant="h6">Müşteri ID: {transactionInfo.customerId}</Typography>
                <Typography variant="h6">Fatura Tarihi: {transactionInfo.invoiceDate?.toLocaleDateString()}</Typography>
                <Typography variant="h6">Vade Tarihi: {transactionInfo.dueDate?.toLocaleDateString()}</Typography>
                <Typography variant="h6">KDV:{transactionInfo.vatRate}</Typography>
                <Typography variant="h6">Para Birimi: {transactionInfo.currency}</Typography>
                <Typography variant="h6">İşlem Türü: {transactionInfo.transactionType}</Typography>
            </Box>
            <Box mt={2} display="flex" justifyContent="flex-end">
                <Button variant="contained" onClick={generatePdf}>
                    PDF Olarak Kaydet
                </Button>
            </Box>
        </Container>
    );
};

export default TransactionSummaryPage;
