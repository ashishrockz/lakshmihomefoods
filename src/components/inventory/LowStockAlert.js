import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  ShoppingCart as OrderIcon,
  Notifications as NotificationsIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import config from '../../config';

const LowStockAlert = () => {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [summaryData, setSummaryData] = useState({
    criticalCount: 0,
    warningCount: 0,
    totalItems: 0
  });
  
  const axios = useAxios();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchLowStockItems();
  }, [page, rowsPerPage, searchTerm]);
  
  const fetchLowStockItems = async () => {
    setLoading(true);
    try {
      const url = `${config.INVENTORY.LOW_STOCK}?page=${page + 1}&limit=${rowsPerPage}${searchTerm ? `&search=${searchTerm}` : ''}`;
      const response = await axios.get(url);
      
      setLowStockItems(response.data.results || []);
      setTotalCount(response.data.count || 0);
      
      // Calculate summary data
      const items = response.data.results || [];
      const critical = items.filter(item => item.quantity === 0).length;
      const warning = items.filter(item => item.quantity > 0 && item.quantity <= item.low_stock_threshold).length;
      
      setSummaryData({
        criticalCount: critical,
        warningCount: warning,
        totalItems: response.data.count || 0
      });
    } catch (error) {
      console.error('Error fetching low stock items:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load low stock data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };
  
  const handleUpdateInventory = (itemId) => {
    navigate(`/inventory/edit/${itemId}`);
  };
  
  const handleCreateOrder = () => {
    navigate('/batches/new');
  };
  
  const handleSendNotification = () => {
    setSnackbar({
      open: true,
      message: 'Low stock notifications sent to supply team',
      severity: 'success'
    });
  };
  
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Low Stock Alerts
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Monitor inventory items that are running low and need to be restocked.
        </Typography>
      </Box>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'error.light' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WarningIcon sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {summaryData.criticalCount}
                  </Typography>
                  <Typography variant="body2">
                    Out of Stock Items
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'warning.light' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <NotificationsIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {summaryData.warningCount}
                  </Typography>
                  <Typography variant="body2">
                    Low Stock Items
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <RefreshIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {summaryData.totalItems}
                  </Typography>
                  <Typography variant="body2">
                    Total Items Needing Attention
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<OrderIcon />}
          onClick={handleCreateOrder}
        >
          Create New Order
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<SendIcon />}
          onClick={handleSendNotification}
        >
          Send Notifications
        </Button>
      </Box>
      
      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            placeholder="Search products..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 500, mr: 2 }}
          />
          
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
          >
            Filter
          </Button>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Variant</TableCell>
                <TableCell align="right">Current Stock</TableCell>
                <TableCell align="right">Threshold</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : lowStockItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No low stock items found
                  </TableCell>
                </TableRow>
              ) : (
                lowStockItems.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      {item.quantity === 0 ? (
                        <Chip 
                          icon={<WarningIcon />}
                          label="Out of Stock" 
                          color="error" 
                          size="small"
                        />
                      ) : (
                        <Chip 
                          label="Low Stock" 
                          color="warning" 
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell>{item.product_variant.product.name}</TableCell>
                    <TableCell>
                      {item.product_variant.size} 
                      {item.product_variant.weight ? ` - ${item.product_variant.weight}` : ''}
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        fontWeight="bold" 
                        color={item.quantity === 0 ? 'error.main' : 'warning.main'}
                      >
                        {item.quantity}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{item.low_stock_threshold}</TableCell>
                    <TableCell>
                      {new Date(item.last_updated).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleUpdateInventory(item.id)}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LowStockAlert;