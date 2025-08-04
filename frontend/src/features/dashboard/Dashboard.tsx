import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    List,
    ListItem,
    ListItemText,
    Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getCustomers, getProducts, getTransactions } from '../../services/dashboard';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    const [totalCustomers, setTotalCustomers] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [newCustomersToday, setNewCustomersToday] = useState(0);
    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
    const [salesOverview, setSalesOverview] = useState({
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
    });
    const [newCustomers, setNewCustomers] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const customersData = (await getCustomers()) || [];
                console.log('customersData received in Dashboard:', customersData);
                setTotalCustomers(customersData.length);

                const productsResponse = (await getProducts()) || {};
                console.log('productsResponse received in Dashboard:', productsResponse);
                const productsData = productsResponse.data || [];
                setTotalProducts(productsData.length);

                const transactionsData = (await getTransactions()) || [];
                console.log('transactionsData received in Dashboard:', transactionsData);
                setTotalTransactions(transactionsData.length);

                // Calculate total revenue
                const revenue = transactionsData.reduce((sum: number, transaction: any) => sum + (Number(transaction.finalAmount) || 0), 0);
                setTotalRevenue(revenue);

                // Calculate new customers today
                const today = new Date();
                const todayString = today.toISOString().split('T')[0];
                const newCustomersTodayCount = customersData.filter((customer: any) => {
                    const customerDate = customer?.createdAt ? new Date(customer.createdAt).toISOString().split('T')[0] : null;
                    return customerDate === todayString;
                }).length;
                setNewCustomersToday(newCustomersTodayCount);

                // Recent transactions (last 4)
                const sortedTransactions = transactionsData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setRecentTransactions(sortedTransactions.slice(0, 4).map((transaction: any) => {
                    const customer = customersData.find((c: any) => c.id === transaction.customerId);
                    return {
                        id: transaction.id,
                        customer: customer ? customer.commercialTitle : 'Bilinmeyen Müşteri',
                        amount: Number(transaction.finalAmount) || 0,
                        type: transaction.type,
                        date: new Date(transaction.createdAt).toLocaleDateString(),
                    };
                }));

                // Sales overview
                const todaySales = transactionsData.filter((t: any) => t?.createdAt && new Date(t.createdAt).toISOString().split('T')[0] === todayString).reduce((sum: number, t: any) => sum + (Number(t.finalAmount) || 0), 0);
                setSalesOverview({
                    today: todaySales,
                    thisWeek: revenue * 0.2, // Placeholder, needs proper backend aggregation
                    thisMonth: revenue * 0.5, // Placeholder, needs proper backend aggregation
                });

                // New customers (last 3)
                const sortedNewCustomers = customersData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setNewCustomers(sortedNewCustomers.slice(0, 3).map((customer: any) => ({
                    id: customer.id,
                    name: customer.commercialTitle,
                    date: new Date(customer.createdAt).toLocaleDateString(),
                })));

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" component="h2" gutterBottom>
                Dashboard
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 20 }} component="div">
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                Toplam Müşteri
                            </Typography>
                            <Typography variant="h3" component="div">
                                {totalCustomers}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 20 }} component="div">
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                Toplam Ürün
                            </Typography>
                            <Typography variant="h3" component="div">
                                {totalProducts}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 20 }} component="div">
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                Toplam İşlem
                            </Typography>
                            <Typography variant="h3" component="div">
                                {totalTransactions}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 20 }} component="div">
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                Toplam Ciro
                            </Typography>
                            <Typography variant="h3" component="div">
                                {totalRevenue} TL
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 20 }} component="div">
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                Bugün Yeni Müşteri
                            </Typography>
                            <Typography variant="h3" component="div">
                                {newCustomersToday}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 20 }} component="div">
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="h3" gutterBottom>
                                Satışlara Genel Bakış
                            </Typography>
                            <List>
                                <ListItem>
                                    <ListItemText primary={`Bugün: ${salesOverview.today} TL`} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary={`Bu Hafta: ${salesOverview.thisWeek} TL`} />
                                </ListItem>
                                <ListItem>
                                    <ListItemText primary={`Bu Ay: ${salesOverview.thisMonth} TL`} />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 20 }} component="div">
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="h3" gutterBottom>
                                Yeni Müşteriler
                            </Typography>
                            <List>
                                {newCustomers.map((customer) => (
                                    <ListItem key={customer.id}>
                                        <ListItemText primary={customer.name} secondary={customer.date} />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 20 }} component="div">
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="h3" gutterBottom>
                                Son İşlemler
                            </Typography>
                            <List>
                                {recentTransactions.map((transaction, index) => (
                                    <React.Fragment key={transaction.id}>
                                        <ListItem>
                                            <ListItemText
                                                primary={`Müşteri: ${transaction.customer} - ${transaction.amount} TL (${transaction.type})`}
                                                secondary={`Tarih: ${transaction.date}`}
                                            />
                                        </ListItem>
                                        {index < recentTransactions.length - 1 && <Divider component="li" />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 20 }} component="div">
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="h3" gutterBottom>
                                Hızlı Erişim
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 20 }} component="div">
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={() => void navigate('/customers')}
                                    >
                                        Müşteriler
                                    </Button>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 20 }} component="div">
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={() => void navigate('/products')}
                                    >
                                        Ürünler
                                    </Button>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 20 }} component="div">
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={() => void navigate('/transactions')}
                                    >
                                        İşlemler
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;