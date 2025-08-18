import React from 'react';
import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import AppHeader from '../components/AppHeader'; // Import the new header component

const MainLayout: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppHeader /> {/* Add the header here */}
            <Container component="main" sx={{ minWidth: '100%',  flexGrow: 1, p: 3 }}>
                <Outlet />
            </Container>
        </Box>
    );
};

export default MainLayout;