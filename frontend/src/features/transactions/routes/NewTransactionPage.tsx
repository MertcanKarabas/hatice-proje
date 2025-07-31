import { Container } from '@mui/material';
import TransactionForm from '../components/TransactionForm';
import TransactionLayout from '../../../layouts/TransactionLayout';

const NewTransactionPage = () => {
    return (
        <TransactionLayout>
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <TransactionForm />
            </Container>
        </TransactionLayout>
    );
};

export default NewTransactionPage;
