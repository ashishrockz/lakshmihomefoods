import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Chip,
  Pagination,
  Stack,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Search, FilterList, Visibility, Edit } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getOrders } from '../../services/order.service';
import { formatCurrency, formatDate } from '../../utils/formatters';

const statusColors = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'error',
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [page, rowsPerPage, filterStatus, searchQuery]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getOrders(
        page,
        rowsPerPage,
        searchQuery,
        filterStatus !== 'all' ? filterStatus : null
      );
      setOrders(response.orders || []);
      setTotalPages(Math.ceil(response.total / rowsPerPage) || 0);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleStatusFilterChange = (event) => {
    setFilterStatus(event.target.value);
    setPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  if (loading && orders.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '1rem' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Order Management
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 0 } }}>
          <TextField
            label="Search Orders"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Order ID, Customer name..."
            InputProps={{ endAdornment: <Search color="action" /> }}
            sx={{ mr: 2, width: { xs: '100%', sm: '250px' } }}
          />
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150, mr: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select value={filterStatus} onChange={handleStatusFilterChange} label="Status">
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="shipped">Shipped</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Payment</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && orders.length > 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{order.customer.name}</TableCell>
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                  <TableCell>{formatCurrency(order.total_amount)}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      color={statusColors[order.status] || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.payment_status}
                      color={order.payment_status === 'paid' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton component={Link} to={`/orders/${order.id}`} color="primary" size="small">
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton
                      component={Link}
                      to={`/orders/${order.id}/edit`}
                      color="secondary"
                      size="small"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Stack spacing={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Stack>
      </Box>
    </Box>
  );
};

export default OrderList;