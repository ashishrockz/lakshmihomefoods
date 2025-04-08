import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
} from '@mui/material';
import {
  LocalShipping,
  Payment,
  Person,
  Receipt,
  Home,
  Phone,
  Email,
  AccessTime,
  ArrowBack,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../../services/order.service';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';
import OrderStatusUpdate from './OrderStatusUpdate';

const statusColors = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'error',
};

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [statusUpdated, setStatusUpdated] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const data = await getOrderById(id); // Adjusted to expect direct data
      setOrder(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Failed to load order details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdateDialogOpen = () => {
    setOpenStatusDialog(true);
  };

  const handleStatusUpdateDialogClose = () => {
    setOpenStatusDialog(false);
  };

  const handleStatusUpdateSuccess = () => {
    setStatusUpdated(true);
    handleStatusUpdateDialogClose();
    fetchOrderDetails();
    setTimeout(() => setStatusUpdated(false), 5000);
  };

  const handleGoBack = () => {
    navigate('/orders');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGoBack}
          sx={{ mt: 2 }}
          startIcon={<ArrowBack />}
        >
          Back to Orders
        </Button>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Order not found</Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGoBack}
          sx={{ mt: 2 }}
          startIcon={<ArrowBack />}
        >
          Back to Orders
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {statusUpdated && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Order status updated successfully!
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={handleGoBack} sx={{ mr: 2 }}>
            Back
          </Button>
          <Typography variant="h5" component="h1">
            Order #{order.id}
          </Typography>
          <Chip
            label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            color={statusColors[order.status] || 'default'}
            sx={{ ml: 2 }}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleStatusUpdateDialogOpen}
          disabled={order.status === 'delivered' || order.status === 'cancelled'}
        >
          Update Status
        </Button>
      </Box>

      {/* Rest of the component remains largely the same, but ensure order data structure matches API response */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Receipt sx={{ mr: 1 }} /> Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Order Date</Typography>
                <Typography variant="body1">{formatDateTime(order.created_at)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Order ID</Typography>
                <Typography variant="body1">#{order.id}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Payment Status</Typography>
                <Chip
                  label={order.payment_status}
                  color={order.payment_status === 'paid' ? 'success' : 'warning'}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Payment Method</Typography>
                <Typography variant="body1">{order.payment_method || 'N/A'}</Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Order Items</Typography>
            <Divider sx={{ mb: 2 }} />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {item.product.image && (
                            <Box
                              component="img"
                              sx={{ width: 50, height: 50, mr: 2, objectFit: 'contain' }}
                              src={item.product.image}
                              alt={item.product.name}
                            />
                          )}
                          <Box>
                            <Typography variant="body1">{item.product.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              SKU: {item.product.sku || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">{formatCurrency(item.unit_price)}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{formatCurrency(item.total_price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Grid container spacing={1}>
                <Grid item xs={7} sm={9}>
                  <Typography variant="body1">Subtotal</Typography>
                </Grid>
                <Grid item xs={5} sm={3} sx={{ textAlign: 'right' }}>
                  <Typography variant="body1">{formatCurrency(order.subtotal)}</Typography>
                </Grid>
                <Grid item xs={7} sm={9}>
                  <Typography variant="body1">Shipping</Typography>
                </Grid>
                <Grid item xs={5} sm={3} sx={{ textAlign: 'right' }}>
                  <Typography variant="body1">{formatCurrency(order.shipping_fee)}</Typography>
                </Grid>
                {order.discount > 0 && (
                  <>
                    <Grid item xs={7} sm={9}>
                      <Typography variant="body1">Discount</Typography>
                    </Grid>
                    <Grid item xs={5} sm={3} sx={{ textAlign: 'right' }}>
                      <Typography variant="body1">-{formatCurrency(order.discount)}</Typography>
                    </Grid>
                  </>
                )}
                {order.tax > 0 && (
                  <>
                    <Grid item xs={7} sm={9}>
                      <Typography variant="body1">Tax</Typography>
                    </Grid>
                    <Grid item xs={5} sm={3} sx={{ textAlign: 'right' }}>
                      <Typography variant="body1">{formatCurrency(order.tax)}</Typography>
                    </Grid>
                  </>
                )}
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={7} sm={9}>
                  <Typography variant="h6">Total</Typography>
                </Grid>
                <Grid item xs={5} sm={3} sx={{ textAlign: 'right' }}>
                  <Typography variant="h6">{formatCurrency(order.total_amount)}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {order.status_history && order.status_history.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTime sx={{ mr: 1 }} /> Order Status History
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {order.status_history.map((status, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <ListItemIcon>
                      <Chip
                        label={status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                        color={statusColors[status.status] || 'default'}
                        size="small"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={status.notes || `Order ${status.status}`}
                      secondary={formatDateTime(status.timestamp)}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Person sx={{ mr: 1 }} /> Customer Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Person fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={order.customer.name} secondary="Customer Name" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Email fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={order.customer.email} secondary="Email Address" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={order.customer.phone || 'N/A'} secondary="Phone Number" />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalShipping sx={{ mr: 1 }} /> Shipping Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List dense>
                <ListItem alignItems="flex-start">
                  <ListItemIcon>
                    <Home fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Shipping Address"
                    secondary={
                      <>
                        {order.shipping_address.street}, <br />
                        {order.shipping_address.city}, {order.shipping_address.state}{' '}
                        {order.shipping_address.zip_code}
                        <br />
                        {order.shipping_address.country}
                      </>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocalShipping fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={order.shipping_method || 'N/A'} secondary="Shipping Method" />
                </ListItem>
                {order.tracking_number && (
                  <ListItem>
                    <ListItemIcon>
                      <Receipt fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={order.tracking_number} secondary="Tracking Number" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Payment sx={{ mr: 1 }} /> Payment Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Payment fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={order.payment_method || 'N/A'} secondary="Payment Method" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Receipt fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={order.transaction_id || 'N/A'}
                    secondary="Transaction ID"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTime fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={order.payment_date ? formatDateTime(order.payment_date) : 'Pending'}
                    secondary="Payment Date"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openStatusDialog} onClose={handleStatusUpdateDialogClose}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Current Status:{' '}
            <Chip
              label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              color={statusColors[order.status] || 'default'}
              size="small"
            />
          </DialogContentText>
          <OrderStatusUpdate
            orderId={order.id}
            currentStatus={order.status}
            onSuccess={handleStatusUpdateSuccess}
            onCancel={handleStatusUpdateDialogClose}
            isDialog={true}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default OrderDetails;