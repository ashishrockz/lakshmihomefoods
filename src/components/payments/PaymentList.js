import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Pagination,
  Stack,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';
import {
  Search,
  FilterList,
  Visibility,
  Receipt,
  CreditCard,
  AccountBalance,
  AttachMoney,
  Close,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getPayments } from '../../services/payment.service';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';

const statusColors = {
  completed: 'success',
  pending: 'warning',
  failed: 'error',
  refunded: 'info',
  cancelled: 'default',
};

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10); // Removed setRowsPerPage since it's not used
  const [totalPages, setTotalPages] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, [page, filterStatus, filterPaymentMethod, sortField, sortDirection, searchQuery]);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: rowsPerPage,
        sort_by: sortField,
        sort_direction: sortDirection,
        search: searchQuery,
        status: filterStatus !== 'all' ? filterStatus : null,
        payment_method: filterPaymentMethod !== 'all' ? filterPaymentMethod : null,
        start_date: dateRange.startDate || null,
        end_date: dateRange.endDate || null,
      };

      const data = await getPayments(params);
      setPayments(data.payments || []);
      setTotalPages(Math.ceil(data.total / rowsPerPage) || 0);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError('Failed to load payments. Please try again later.');
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

  const handlePaymentMethodFilterChange = (event) => {
    setFilterPaymentMethod(event.target.value);
    setPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    fetchPayments();
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setPage(1);
  };

  const handleDateRangeChange = (field) => (event) => {
    setDateRange((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const applyDateFilter = () => {
    setPage(1);
    fetchPayments();
  };

  const handleViewPaymentDetails = (payment) => {
    setSelectedPayment(payment);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedPayment(null);
  };

  const renderPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'credit_card':
        return <CreditCard />;
      case 'bank_transfer':
        return <AccountBalance />;
      case 'cash':
        return <AttachMoney />;
      default:
        return <Receipt />;
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'credit_card':
        return 'Credit Card';
      case 'bank_transfer':
        return 'Bank Transfer';
      case 'paypal':
        return 'PayPal';
      case 'cash':
        return 'Cash';
      default:
        return method || 'Unknown';
    }
  };

  if (loading && payments.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '1rem' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Payment Transactions
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 0 } }}
        >
          <TextField
            label="Search Transactions"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Transaction ID, Customer..."
            InputProps={{
              endAdornment: (
                <IconButton type="submit" size="small">
                  <Search color="action" />
                </IconButton>
              ),
            }}
            sx={{ mr: 2, width: { xs: '100%', sm: '250px' } }}
          />
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150, mr: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select value={filterStatus} onChange={handleStatusFilterChange} label="Status">
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
              <MenuItem value="refunded">Refunded</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Payment Method</InputLabel>
            <Select value={filterPaymentMethod} onChange={handlePaymentMethodFilterChange} label="Payment Method">
              <MenuItem value="all">All Methods</MenuItem>
              <MenuItem value="credit_card">Credit Card</MenuItem>
              <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
              <MenuItem value="paypal">PayPal</MenuItem>
              <MenuItem value="cash">Cash</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <TextField
              label="From"
              type="date"
              size="small"
              value={dateRange.startDate}
              onChange={handleDateRangeChange('startDate')}
              InputLabelProps={{ shrink: true }}
              sx={{ mr: 1, width: { xs: '100%', sm: '130px' } }}
            />
            <TextField
              label="To"
              type="date"
              size="small"
              value={dateRange.endDate}
              onChange={handleDateRangeChange('endDate')}
              InputLabelProps={{ shrink: true }}
              sx={{ width: { xs: '100%', sm: '130px' } }}
            />
          </Box>
          <Button variant="contained" color="primary" onClick={applyDateFilter} startIcon={<FilterList />} size="small">
            Apply Filters
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => handleSort('id')} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Transaction ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell onClick={() => handleSort('order_id')} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Order ID {sortField === 'order_id' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell onClick={() => handleSort('created_at')} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Date {sortField === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell onClick={() => handleSort('payment_method')} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Method {sortField === 'payment_method' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell onClick={() => handleSort('amount')} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Amount {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell onClick={() => handleSort('status')} sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : payments.length > 0 ? (
              payments.map((payment) => (
                <TableRow key={payment.id} hover>
                  <TableCell>{payment.transaction_id || payment.id}</TableCell>
                  <TableCell>
                    {payment.order_id ? (
                      <Link to={`/orders/${payment.order_id}`}>#{payment.order_id}</Link>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>{formatDate(payment.created_at)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {renderPaymentMethodIcon(payment.payment_method)}
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {getPaymentMethodLabel(payment.payment_method)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>
                    <Chip
                      label={payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      color={statusColors[payment.status] || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton onClick={() => handleViewPaymentDetails(payment)} color="primary" size="small">
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No payment transactions found
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

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={closeDrawer}
        sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 400 }, padding: 2 } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Payment Details</Typography>
          <IconButton onClick={closeDrawer}>
            <Close />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {selectedPayment && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">Transaction ID</Typography>
              <Typography variant="body1">{selectedPayment.transaction_id || selectedPayment.id}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <List disablePadding>
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Order ID" />
                {selectedPayment.order_id ? (
                  <Link to={`/orders/${selectedPayment.order_id}`} onClick={closeDrawer}>
                    #{selectedPayment.order_id}
                  </Link>
                ) : (
                  'N/A'
                )}
              </ListItem>
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Date & Time" />
                <Typography variant="body2">{formatDateTime(selectedPayment.created_at)}</Typography>
              </ListItem>
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Customer" />
                <Typography variant="body2">{selectedPayment.customer?.name || 'N/A'}</Typography>
              </ListItem>
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Payment Method" />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {renderPaymentMethodIcon(selectedPayment.payment_method)}
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {getPaymentMethodLabel(selectedPayment.payment_method)}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Amount" />
                <Typography variant="body2" fontWeight="bold">
                  {formatCurrency(selectedPayment.amount)}
                </Typography>
              </ListItem>
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Status" />
                <Chip
                  label={selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                  color={statusColors[selectedPayment.status] || 'default'}
                  size="small"
                />
              </ListItem>
              {selectedPayment.card_info && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                    Card Information
                  </Typography>
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Card Type" />
                    <Typography variant="body2">{selectedPayment.card_info.brand || 'N/A'}</Typography>
                  </ListItem>
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Last 4 Digits" />
                    <Typography variant="body2">
                      **** **** **** {selectedPayment.card_info.last4 || 'N/A'}
                    </Typography>
                  </ListItem>
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Expiry" />
                    <Typography variant="body2">
                      {selectedPayment.card_info.exp_month || 'N/A'}/{selectedPayment.card_info.exp_year || 'N/A'}
                    </Typography>
                  </ListItem>
                </>
              )}
              {selectedPayment.refund_info && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                    Refund Information
                  </Typography>
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Refund ID" />
                    <Typography variant="body2">{selectedPayment.refund_info.refund_id || 'N/A'}</Typography>
                  </ListItem>
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Refund Date" />
                    <Typography variant="body2">
                      {selectedPayment.refund_info.refund_date
                        ? formatDateTime(selectedPayment.refund_info.refund_date)
                        : 'N/A'}
                    </Typography>
                  </ListItem>
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Refund Amount" />
                    <Typography variant="body2">
                      {formatCurrency(selectedPayment.refund_info.amount) || 'N/A'}
                    </Typography>
                  </ListItem>
                  <ListItem sx={{ py: 1, px: 0 }}>
                    <ListItemText primary="Reason" />
                    <Typography variant="body2">{selectedPayment.refund_info.reason || 'N/A'}</Typography>
                  </ListItem>
                </>
              )}
              {selectedPayment.notes && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                    Notes
                  </Typography>
                  <Typography variant="body2" sx={{ px: 1 }}>
                    {selectedPayment.notes}
                  </Typography>
                </>
              )}
            </List>
            {selectedPayment.status === 'failed' && selectedPayment.error_message && (
              <>
                <Divider sx={{ my: 2 }} />
                <Alert severity="error">
                  <Typography variant="subtitle2">Error Details</Typography>
                  <Typography variant="body2">{selectedPayment.error_message}</Typography>
                </Alert>
              </>
            )}
            {selectedPayment.status === 'pending' && selectedPayment.order_id && (
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  component={Link}
                  to={`/orders/${selectedPayment.order_id}`}
                  onClick={closeDrawer}
                >
                  View Order Details
                </Button>
              </Box>
            )}
          </>
        )}
      </Drawer>
    </Box>
  );
};

export default PaymentList;