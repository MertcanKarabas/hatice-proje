import React from 'react';
import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            {/* Add a sidebar/header here if needed */}
            <Container component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Outlet />
            </Container>
        </Box>
    );
};

export default MainLayout;
