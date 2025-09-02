import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

import { localizeTransactionType } from '../../transactions/services/localization.service';
import TransactionFilter from "../../transactions/components/TransactionFilter"
import { useCustomerTransactions } from '../hooks/useCustomerTransactions';

const CustomerTransactions: React.FC = () => {
    const { customerId } = useParams<{ customerId: string }>();
    const [filter, setFilter] = useState<{ field: string; operator: string; value: string }>(
        {
            field: 'customer.commercialTitle',
            operator: 'contains',
            value: '',
        }
    );
    const { transactions, fetchTransactions } = useCustomerTransactions(customerId, filter);
    const navigate = useNavigate();

    const handleViewDetails = (id: string) => {
        void navigate(`/transactions/${id}`);
    };
    return (
        <Container maxWidth="xl">
            <Typography variant="h4" component="h2" gutterBottom>
                Müşteri İşlemleri: {customerId}
            </Typography>
            <TransactionFilter filter={filter} setFilter={setFilter} onApply={fetchTransactions} />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>İşlem Tipi</TableCell>
                            <TableCell>Toplam Tutar</TableCell>
                            <TableCell>İndirim Tutarı</TableCell>
                            <TableCell>Son Tutar</TableCell>
                            <TableCell>Para Birimi</TableCell>
                            <TableCell>Kar</TableCell>
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
                                <TableCell>{transaction.exchange?.code}</TableCell>
                                <TableCell>{transaction.type === 'SALE' ? Number(transaction.profit ?? 0).toFixed(2) : '-'}</TableCell>
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