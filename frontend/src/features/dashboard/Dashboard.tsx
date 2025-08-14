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
import { AxiosError } from 'axios';
import { getCustomers, getProducts, getTransactions } from '../../services/dashboard';
import { localizeTransactionType } from '../transactions/services/localization.service';
import type { Customer, Product, Transaction } from '../../../types';

interface RecentTransaction {
    id: string;
    customer: string; // commercialTitle
    amount: number; // finalAmount
    type: 'SALE' | 'PURCHASE' | 'PAYMENT' | 'COLLECTION';
    date: string; // formatted date string
}

interface NewCustomer {
    id: string;
    name: string; // commercialTitle
    date: string; // formatted date string
}

// Helper function to validate and transform Customer data
const validateCustomer = (data: unknown): Customer | null => {
    if (typeof data !== 'object' || data === null) return null;
    const customer = data as Record<string, unknown>;

    if (typeof customer.id !== 'string') return null;
    if (typeof customer.commercialTitle !== 'string') return null;
    // Add more validation for other required fields if necessary
    return {
        id: customer.id as string,
        commercialTitle: customer.commercialTitle as string,
        address: typeof customer.address === 'string' ? customer.address : '',
        phone: typeof customer.phone === 'string' ? customer.phone : '',
        taxOffice: typeof customer.taxOffice === 'string' ? customer.taxOffice : '',
        taxNumber: typeof customer.taxNumber === 'string' ? customer.taxNumber : '',
        email: typeof customer.email === 'string' ? customer.email : '',
        type: (customer.type === 'SALES' || customer.type === 'PURCHASE') ? customer.type : 'SALES',
        balance: typeof customer.balance === 'number' ? customer.balance : 0,
        createdAt: typeof customer.createdAt === 'string' ? customer.createdAt : '',
        updatedAt: typeof customer.updatedAt === 'string' ? customer.updatedAt : '',
        userId: typeof customer.userId === 'string' ? customer.userId : '',
    };
};

// Helper function to validate and transform Transaction data
const validateTransaction = (data: unknown): Transaction | null => {
    if (typeof data !== 'object' || data === null) return null;
    const transaction = data as Record<string, unknown>;

    if (typeof transaction.id !== 'string') return null;
    if (typeof transaction.type !== 'string') return null;
    // Add more validation for other required fields if necessary
    return {
        id: transaction.id as string,
        customerId: typeof transaction.customerId === 'string' ? transaction.customerId : '',
        invoiceDate: typeof transaction.invoiceDate === 'string' ? transaction.invoiceDate : '',
        dueDate: typeof transaction.dueDate === 'string' ? transaction.dueDate : '',
        vatRate: typeof transaction.vatRate === 'number' ? transaction.vatRate : 0,
        currency: typeof transaction.currency === 'string' ? transaction.currency : '',
        type: (transaction.type === 'SALE' || transaction.type === 'PURCHASE' || transaction.type === 'PAYMENT' || transaction.type === 'COLLECTION') ? transaction.type : 'SALE',
        totalAmount: typeof transaction.totalAmount === 'string' ? Number(transaction.totalAmount) : transaction.totalAmount as number,
        discountAmount: typeof transaction.discountAmount === 'string' ? Number(transaction.discountAmount) : transaction.discountAmount as number,
        finalAmount: typeof transaction.finalAmount === 'string' ? Number(transaction.finalAmount) : transaction.finalAmount as number,
        createdAt: typeof transaction.createdAt === 'string' ? transaction.createdAt : '',
        updatedAt: typeof transaction.updatedAt === 'string' ? transaction.updatedAt : '',
        items: Array.isArray(transaction.items) ? transaction.items.map(item => ({
            productId: typeof item.productId === 'string' ? item.productId : '',
            product: item.product as Product,
            quantity: typeof item.quantity === 'number' ? item.quantity : 0,
            unit: typeof item.unit === 'string' ? item.unit : '',
            price: typeof item.price === 'number' ? item.price : 0,
            vatRate: typeof item.vatRate === 'number' ? item.vatRate : 0,
            total: typeof item.total === 'number' ? item.total : 0,
        })) : [],
        customer: transaction.customer ? validateCustomer(transaction.customer) : undefined,
    };
};

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    const [totalCustomers, setTotalCustomers] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [newCustomersToday, setNewCustomersToday] = useState(0);
    const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
    const [salesOverview, setSalesOverview] = useState({
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
    });
    const [newCustomers, setNewCustomers] = useState<NewCustomer[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rawCustomersData = (await getCustomers()) ?? [];
                const customersData = rawCustomersData.map(validateCustomer).filter(Boolean) as Customer[];
                console.log('customersData received in Dashboard:', customersData);
                setTotalCustomers(customersData.length);

                const productsResponse = (await getProducts()) ?? { data: [] };
                const productsData = productsResponse.data ?? [];
                setTotalProducts(productsData.length);

                const rawTransactionsData = (await getTransactions()) ?? [];
                const transactionsData = rawTransactionsData.map(validateTransaction).filter(Boolean) as Transaction[];
                console.log('transactionsData received in Dashboard:', transactionsData);
                setTotalTransactions(transactionsData.length);

                // Calculate total revenue
                const revenue = transactionsData.reduce((sum: number, transaction: Transaction) => sum + (Number(transaction.finalAmount ?? 0)), 0);
                setTotalRevenue(revenue);

                // Calculate new customers today
                const today = new Date();
                const todayString = today.toISOString().split('T')[0];
                const newCustomersTodayCount = customersData.filter((customer: Customer) => {
                    const customerDate = customer.createdAt ? new Date(customer.createdAt).toISOString().split('T')[0] : null;
                    return customerDate === todayString;
                }).length;
                setNewCustomersToday(newCustomersTodayCount);

                // Recent transactions (last 4)
                const sortedTransactions = transactionsData.sort((a: Transaction, b: Transaction) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA;
                });
                setRecentTransactions(sortedTransactions.slice(0, 4).map((transaction: Transaction) => {
                    const customer = customersData.find((c: Customer) => c.id === transaction.customerId);
                    return {
                        id: transaction.id,
                        customer: customer?.commercialTitle ?? 'Bilinmeyen Müşteri',
                        amount: Number(transaction.finalAmount ?? 0),
                        type: transaction.type,
                        date: new Date(transaction.createdAt).toLocaleDateString(),
                    };
                }));

                // Sales overview
                const todaySales = transactionsData.filter((t: Transaction) => t.createdAt && new Date(t.createdAt).toISOString().split('T')[0] === todayString).reduce((sum: number, t: Transaction) => sum + (Number(t.finalAmount ?? 0)), 0);
                setSalesOverview({
                    today: todaySales,
                    thisWeek: revenue * 0.2, // Placeholder, needs proper backend aggregation
                    thisMonth: revenue * 0.5, // Placeholder, needs proper backend aggregation
                });

                // New customers (last 3)
                const sortedNewCustomers = customersData.sort((a: Customer, b: Customer) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA;
                });
                setNewCustomers(sortedNewCustomers.slice(0, 3).map((customer: Customer) => ({
                    id: customer.id,
                    name: customer.commercialTitle,
                    date: new Date(customer.createdAt).toLocaleDateString(),
                })));

            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    console.error('Error fetching dashboard data:', error.message);
                } else {
                    console.error('Error fetching dashboard data:', error);
                }
            }
        };

        void fetchData();
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
                                                primary={`Müşteri: ${transaction.customer} - ${transaction.amount} TL (${localizeTransactionType(transaction.type)})`}
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