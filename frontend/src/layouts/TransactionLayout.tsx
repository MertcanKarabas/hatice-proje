import React from 'react';
import { Box, Container } from '@mui/material';

interface TransactionLayoutProps {
    children: React.ReactNode;
}

const TransactionLayout: React.FC<TransactionLayoutProps> = ({ children }) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <Container component="main" sx={{ flexGrow: 1, p: 3 }}>
                {children}
            </Container>
        </Box>
    );
};

export default TransactionLayout;
