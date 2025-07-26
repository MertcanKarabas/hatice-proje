import React from 'react';
import { Container } from '@mui/material';
import TransactionForm from '../../components/TransactionForm';

const NewTransactionPage = () => {
    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <TransactionForm />
        </Container>
    );
};

export default NewTransactionPage;
