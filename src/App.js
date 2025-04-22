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

// Layout Component
import MainLayout from './components/layout/MainLayout';

// Auth Components
import Login from './components/auth/Login';
import ForgotPassword from './components/auth/ForgotPassword';
import ChangePassword from './components/auth/ChangePassword';
import ResetPassword from './components/auth/ResetPassword';

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

// Static Pages
import PrivacyPolicy from './components/static/PrivacyPolicy';
import TermsOfService from './components/static/TermsOfService.js';
import Contact from './components/static/Contact';

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
            <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />
            <Route
              path="/privacy-policy"
              element={
                <MainLayout>
                  <PrivacyPolicy />
                </MainLayout>
              }
            />
            <Route
              path="/terms-of-service"
              element={
                <MainLayout>
                  <TermsOfService />
                </MainLayout>
              }
            />
            <Route
              path="/contact"
              element={
                <MainLayout>
                  <Contact />
                </MainLayout>
              }
            />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/dashboard"
                element={
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                }
              />
              {/* Product Routes */}
              <Route
                path="/products"
                element={
                  <MainLayout>
                    <ProductList />
                  </MainLayout>
                }
              />
              <Route
                path="/products/new"
                element={
                  <MainLayout>
                    <ProductForm />
                  </MainLayout>
                }
              />
              <Route
                path="/products/edit/:id"
                element={
                  <MainLayout>
                    <ProductForm />
                  </MainLayout>
                }
              />
              <Route
                path="/categories"
                element={
                  <MainLayout>
                    <CategoryList />
                  </MainLayout>
                }
              />
              <Route
                path="/categories/new"
                element={
                  <MainLayout>
                    <CategoryForm />
                  </MainLayout>
                }
              />
              <Route
                path="/categories/edit/:slug"
                element={
                  <MainLayout>
                    <CategoryForm />
                  </MainLayout>
                }
              />
              {/* Inventory Routes */}
              <Route
                path="/inventory"
                element={
                  <MainLayout>
                    <InventoryList />
                  </MainLayout>
                }
              />
              <Route
                path="/batches"
                element={
                  <MainLayout>
                    <BatchList />
                  </MainLayout>
                }
              />
              <Route
                path="/low-stock"
                element={
                  <MainLayout>
                    <LowStockAlert />
                  </MainLayout>
                }
              />
              {/* Order Routes */}
              <Route
                path="/orders"
                element={
                  <MainLayout>
                    <OrderList />
                  </MainLayout>
                }
              />
              <Route
                path="/orders/:id"
                element={
                  <MainLayout>
                    <OrderDetails />
                  </MainLayout>
                }
              />
              <Route
                path="/orders/:id/update"
                element={
                  <MainLayout>
                    <OrderStatusUpdate />
                  </MainLayout>
                }
              />
              {/* Payment Routes */}
              <Route
                path="/payments"
                element={
                  <MainLayout>
                    <PaymentList />
                  </MainLayout>
                }
              />
              {/* Profile & Password */}
              <Route
                path="/change-password"
                element={
                  <MainLayout>
                    <ChangePassword />
                  </MainLayout>
                }
              />
            </Route>
            
            {/* Admin Only Routes */}
            <Route element={<AdminRoute />}>
              <Route
                path="/users"
                element={
                  <MainLayout>
                    <UserList />
                  </MainLayout>
                }
              />
              <Route
                path="/users/new"
                element={
                  <MainLayout>
                    <UserForm />
                  </MainLayout>
                }
              />
              <Route
                path="/users/edit/:id"
                element={
                  <MainLayout>
                    <UserForm />
                  </MainLayout>
                }
              />
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