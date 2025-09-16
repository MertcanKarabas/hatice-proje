import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const AppHeader: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Firma
          </Link>
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button color="inherit" component={Link} to="/customers">
            Müşteriler
          </Button>
          <Button color="inherit" component={Link} to="/products">
            Ürünler
          </Button>
          <Button color="inherit" component={Link} to="/transactions">
            İşlemler
          </Button>
          <Button color="inherit" component={Link} to="/reports">
            Raporlar
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;