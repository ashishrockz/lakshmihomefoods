import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Inventory,
  AttachMoney,
  People,
  MoreHoriz
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import RevenueChart from './RevenueChart';
import SalesOverview from './SalesOverview';
import StatCards from './StatCards';
import useAxios from '../../hooks/useAxios';
import config from '../../config';

const Dashboard = () => {
  const [orderData, setOrderData] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const axios = useAxios();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch recent orders
        const ordersResponse = await axios.get(`${config.ORDERS.ALL}?limit=5`);
        setOrderData(ordersResponse.data.results || []);
        
        // Fetch low stock items
        const lowStockResponse = await axios.get(config.INVENTORY.LOW_STOCK);
        setLowStockItems(lowStockResponse.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [axios]);
  
  // Mock data for demonstration
  const stats = [
    { title: 'Today\'s Sales', value: '$2,845', icon: <AttachMoney color="primary" />, change: '+12.5%', up: true },
    { title: 'Orders', value: '78', icon: <ShoppingBag color="secondary" />, change: '+8.2%', up: true },
    { title: 'Inventory', value: '1,240', icon: <Inventory color="success" />, change: '-2.4%', up: false },
    { title: 'New Customers', value: '15', icon: <People color="info" />, change: '+4.6%', up: true }
  ];
  
  const revenueData = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 5000 },
    { month: 'Apr', revenue: 8000 },
    { month: 'May', revenue: 6000 },
    { month: 'Jun', revenue: 9500 },
    { month: 'Jul', revenue: 11000 },
    { month: 'Aug', revenue: 8500 },
    { month: 'Sep', revenue: 10000 },
    { month: 'Oct', revenue: 12500 },
    { month: 'Nov', revenue: 14000 },
    { month: 'Dec', revenue: 16500 }
  ];
  
  const salesData = {
    categories: [
      { name: 'Dill Pickles', value: 35 },
      { name: 'Garlic Pickles', value: 25 },
      { name: 'Spicy Pickles', value: 20 },
      { name: 'Sweet Pickles', value: 15 },
      { name: 'Other', value: 5 }
    ]
  };
  
  const getStatusChipColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'PROCESSING':
        return 'info';
      case 'SHIPPED':
        return 'primary';
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };
  
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome back! Here's what's happening with your store today.
          </Typography>
        </Box>
        
        <Box>
          <Button 
            variant="contained" 
            onClick={() => navigate('/products/new')}
            sx={{ mr: 2 }}
          >
            Add New Product
          </Button>
          <Button 
            variant="outlined"
            onClick={() => navigate('/reports')}
          >
            View Reports
          </Button>
        </Box>
      </Box>
      
      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCards stat={stat} />
          </Grid>
        ))}
      </Grid>
      
      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Revenue</Typography>
              <Button 
                size="small" 
                endIcon={<MoreHoriz />}
                onClick={() => navigate('/reports/revenue')}
              >
                View Details
              </Button>
            </Box>
            <RevenueChart data={revenueData} />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Sales by Category</Typography>
              <Button 
                size="small" 
                endIcon={<MoreHoriz />}
                onClick={() => navigate('/reports/sales')}
              >
                View Details
              </Button>
            </Box>
            <SalesOverview data={salesData} />
          </Paper>
        </Grid>
      </Grid>
      
      {/* Recent Orders & Low Stock */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Recent Orders</Typography>
              <Button 
                size="small" 
                onClick={() => navigate('/orders')}
              >
                View All
              </Button>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order #</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderData.length > 0 ? (
                    orderData.map((order) => (
                      <TableRow key={order.id} hover>
                        <TableCell>{order.order_number}</TableCell>
                        <TableCell>{order.email.split('@')[0]}</TableCell>
                        <TableCell align="right">${order.total}</TableCell>
                        <TableCell>
                          {new Date(order.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={order.status} 
                            color={getStatusChipColor(order.status)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        {loading ? 'Loading...' : 'No recent orders found'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Low Stock Alert</Typography>
              <Button 
                size="small" 
                color="error"
                onClick={() => navigate('/low-stock')}
              >
                View All
              </Button>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Variant</TableCell>
                    <TableCell align="right">Current</TableCell>
                    <TableCell align="right">Threshold</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lowStockItems.length > 0 ? (
                    lowStockItems.slice(0, 5).map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell>{item.product_variant.product.name}</TableCell>
                        <TableCell>{item.product_variant.size}</TableCell>
                        <TableCell align="right" sx={{ color: 'error.main', fontWeight: 'bold' }}>
                          {item.quantity}
                        </TableCell>
                        <TableCell align="right">
                          {item.low_stock_threshold}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        {loading ? 'Loading...' : 'No low stock items found'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;