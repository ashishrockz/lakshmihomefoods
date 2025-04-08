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
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Snackbar,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  History as HistoryIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import config from '../../config';

const InventoryList = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
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
  
  // Menu state
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  
  // Update Quantity Dialog
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [quantityToAdd, setQuantityToAdd] = useState(0);
  
  const axios = useAxios();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchInventory();
  }, [page, rowsPerPage, searchTerm]);
  
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const url = `${config.INVENTORY.ALL}?page=${page + 1}&limit=${rowsPerPage}${searchTerm ? `&search=${searchTerm}` : ''}`;
      const response = await axios.get(url);
      
      setInventoryItems(response.data.results || []);
      setTotalCount(response.data.count || 0);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load inventory data',
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
  
  const handleMenuOpen = (event, itemId) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedItemId(itemId);
  };
  
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedItemId(null);
  };
  
  const handleAddInventory = () => {
    navigate('/inventory/new');
  };
  
  const handleEditInventory = (itemId) => {
    navigate(`/inventory/edit/${itemId}`);
    handleMenuClose();
  };
  
  const handleViewHistory = (itemId) => {
    navigate(`/inventory/history/${itemId}`);
    handleMenuClose();
  };
  
  const handleUpdateQuantity = (itemId) => {
    setSelectedItemId(itemId);
    setQuantityToAdd(0);
    setOpenUpdateDialog(true);
    handleMenuClose();
  };
  
  const handleUpdateSubmit = async () => {
    try {
      await axios.post(`${config.INVENTORY.ALL}${selectedItemId}/update_quantity/`, {
        quantity_change: parseInt(quantityToAdd),
        note: 'Manual adjustment'
      });
      
      setSnackbar({
        open: true,
        message: 'Inventory quantity updated successfully',
        severity: 'success'
      });
      
      fetchInventory();
    } catch (error) {
      console.error('Error updating quantity:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update inventory quantity',
        severity: 'error'
      });
    } finally {
      setOpenUpdateDialog(false);
    }
  };
  
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">
          Inventory
        </Typography>
        
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchInventory}
            sx={{ mr: 2 }}
          >
            Refresh
          </Button>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddInventory}
          >
            Add Inventory Item
          </Button>
        </Box>
      </Box>
      
      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            placeholder="Search inventory..."
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
                <TableCell>Product</TableCell>
                <TableCell>Variant</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Low Stock Threshold</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell>Status</TableCell>
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
              ) : inventoryItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No inventory items found
                  </TableCell>
                </TableRow>
              ) : (
                inventoryItems.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.product_variant.product.name}</TableCell>
                    <TableCell>
                      {item.product_variant.size} 
                      {item.product_variant.weight ? ` - ${item.product_variant.weight}` : ''}
                    </TableCell>
                    <TableCell align="right">
                      {item.quantity < item.low_stock_threshold ? (
                        <Typography color="error" fontWeight="bold">
                          {item.quantity}
                        </Typography>
                      ) : (
                        item.quantity
                      )}
                    </TableCell>
                    <TableCell align="right">{item.low_stock_threshold}</TableCell>
                    <TableCell>
                      {new Date(item.last_updated).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {item.quantity < item.low_stock_threshold ? (
                        <Chip 
                          icon={<WarningIcon />}
                          label="Low Stock" 
                          color="error" 
                          size="small"
                        />
                      ) : (
                        <Chip 
                          label="In Stock" 
                          color="success" 
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, item.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
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
      
      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleUpdateQuantity(selectedItemId)}>
          <RefreshIcon fontSize="small" sx={{ mr: 1 }} />
          Update Quantity
        </MenuItem>
        <MenuItem onClick={() => handleEditInventory(selectedItemId)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleViewHistory(selectedItemId)}>
          <HistoryIcon fontSize="small" sx={{ mr: 1 }} />
          View History
        </MenuItem>
      </Menu>
      
      {/* Update Quantity Dialog */}
      <Dialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
      >
        <DialogTitle>Update Inventory Quantity</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter the quantity to add or remove. Use positive numbers to add inventory 
            and negative numbers to remove inventory.
          </DialogContentText>
          
          <TextField
            label="Quantity Change"
            type="number"
            fullWidth
            value={quantityToAdd}
            onChange={(e) => setQuantityToAdd(e.target.value)}
            InputProps={{
              inputProps: { min: -1000, max: 1000 }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateSubmit} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
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

export default InventoryList;
