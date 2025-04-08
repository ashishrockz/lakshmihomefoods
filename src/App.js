import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

// Context Providers
import { AuthProvider } from './context/AuthContext';

// Route Protection Components
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

// Auth Components
import Login from './components/auth/Login';
import ForgotPassword from './components/auth/ForgotPassword';
import ChangePassword from './components/auth/ChangePassword';

// Dashboard Components
import Dashboard from './components/dashboard/Dashboard';

// Product Components
import ProductList from './components/products/ProductList';
import ProductForm from './components/products/ProductForm';
import CategoryList from './components/products/CategoryList';
import CategoryForm from './components/products/CategoryForm';

// Inventory Components
import InventoryList from './components/inventory/InventoryList';
import BatchList from './components/inventory/BatchList';
import LowStockAlert from './components/inventory/LowStockAlert';

// Order Components
import OrderList from './components/orders/OrderList';
import OrderDetails from './components/orders/OrderDetails';
import OrderStatusUpdate from './components/orders/OrderStatusUpdate';

// Payment Components
import PaymentList from './components/payments/PaymentList';

// User Components
import UserList from './components/users/UserList';
import UserForm from './components/users/UserForm';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Product Routes */}
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/new" element={<ProductForm />} />
              <Route path="/products/edit/:id" element={<ProductForm />} />
              <Route path="/categories" element={<CategoryList />} />
              <Route path="/categories/new" element={<CategoryForm />} />
              <Route path="/categories/edit/:id" element={<CategoryForm />} />
              
              {/* Inventory Routes */}
              <Route path="/inventory" element={<InventoryList />} />
              <Route path="/batches" element={<BatchList />} />
              <Route path="/low-stock" element={<LowStockAlert />} />
              
              {/* Order Routes */}
              <Route path="/orders" element={<OrderList />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/orders/:id/update" element={<OrderStatusUpdate />} />
              
              {/* Payment Routes */}
              <Route path="/payments" element={<PaymentList />} />
              
              {/* Profile & Password */}
              <Route path="/change-password" element={<ChangePassword />} />
            </Route>
            
            {/* Admin Only Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/users" element={<UserList />} />
              <Route path="/users/new" element={<UserForm />} />
              <Route path="/users/edit/:id" element={<UserForm />} />
            </Route>
            
            {/* Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;