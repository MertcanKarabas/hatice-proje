import { createBrowserRouter } from 'react-router-dom';
import Login from '../features/auth/components/Login';
import Dashboard from '../features/dashboard/Dashboard';
import Products from '../features/products/components/Products';
import NewTransactionPage from '../features/transactions/routes/NewTransactionPage';
import Customers from '../features/customers/components/Customers';
import CustomerTransactions from '../features/customers/components/CustomerTransactions';
import ProtectedRoute from '../features/auth/components/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import TransactionSelectProducts from '../features/transactions/components/TransactionSelectProducts';
import TransactionSummaryPage from '../features/transactions/routes/TransactionSummaryPage';
import CustomerPaymentCollection from '../features/customers/components/CustomerPaymentCollection';
import TransactionsList from '../features/transactions/components/TransactionsList';
import TransactionDetails from '../features/transactions/components/TransactionDetails';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  /*{
    path: '/register',
    element: <Register />,
  },*/
  {
    path: '/',
    element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'products',
        element: <Products />,
      },
      {
        path: 'customers',
        element: <Customers />,
      },
      {
        path: 'customers/:customerId/transactions',
        element: <CustomerTransactions />,
      },
      {
        path: 'customers/:customerId/payment-collection',
        element: <CustomerPaymentCollection />,
      },
      {
        path: 'transactions',
        element: <TransactionsList />,
      },
      {
        path: 'transactions/new',
        element: <NewTransactionPage />,
      },
      {
        path: 'transactions/:id',
        element: <TransactionDetails />,
      },
      {
        path: 'transactions/select-products',
        element: <TransactionSelectProducts />
      },
      {
        path: 'transactions/summary',
        element: <TransactionSummaryPage />
      }
    ],
  },
]);
