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
  DialogTitle,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Archive as ArchiveIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import config from '../../config';

const BatchList = () => {
  const [batches, setBatches] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Menu state
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  
  const axios = useAxios();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchBatches();
  }, [page, rowsPerPage, searchTerm]);
  
  const fetchBatches = async () => {
    setLoading(true);
    try {
      const url = `${config.INVENTORY.BATCHES}?page=${page + 1}&limit=${rowsPerPage}${searchTerm ? `&search=${searchTerm}` : ''}`;
      const response = await axios.get(url);
      
      setBatches(response.data.results || []);
      setTotalCount(response.data.count || 0);
    } catch (error) {
      console.error('Error fetching batches:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load batch data',
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
  
  const handleMenuOpen = (event, batchId) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedBatchId(batchId);
  };
  
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedBatchId(null);
  };
  
  const handleAddBatch = () => {
    navigate('/batches/new');
  };
  
  const handleEditBatch = (batchId) => {
    navigate(`/batches/edit/${batchId}`);
    handleMenuClose();
  };
  
  const handleViewBatch = (batchId) => {
    navigate(`/batches/${batchId}`);
    handleMenuClose();
  };
  
  const handleDeleteClick = (batchId) => {
    setBatchToDelete(batchId);
    setOpenDeleteDialog(true);
    handleMenuClose();
  };
  
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${config.INVENTORY.BATCHES}${batchToDelete}/`);
      setBatches(batches.filter(batch => batch.id !== batchToDelete));
      setSnackbar({
        open: true,
        message: 'Batch deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting batch:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete batch',
        severity: 'error'
      });
    } finally {
      setOpenDeleteDialog(false);
      setBatchToDelete(null);
    }
  };
  
  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setBatchToDelete(null);
  };
  
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  const getBatchStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'RECEIVED':
        return 'success';
      case 'PARTIALLY_RECEIVED':
        return 'info';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };
  
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">
          Inventory Batches
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddBatch}
        >
          Add New Batch
        </Button>
      </Box>
      
      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            placeholder="Search batches..."
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
                <TableCell>Batch Number</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell>Expected Date</TableCell>
                <TableCell>Received Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : batches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No batches found
                  </TableCell>
                </TableRow>
              ) : (
                batches.map((batch) => (
                  <TableRow key={batch.id} hover>
                    <TableCell>{batch.batch_number}</TableCell>
                    <TableCell>
                      {batch.product_variant.product.name} - {batch.product_variant.size}
                    </TableCell>
                    <TableCell>{batch.supplier.name}</TableCell>
                    <TableCell align="right">
                      {batch.received_quantity !== null 
                        ? `${batch.received_quantity}/${batch.expected_quantity}` 
                        : batch.expected_quantity}
                    </TableCell>
                    <TableCell>
                      {new Date(batch.expected_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {batch.received_date 
                        ? new Date(batch.received_date).toLocaleDateString() 
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={batch.status} 
                        color={getBatchStatusColor(batch.status)} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, batch.id)}
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
        <MenuItem onClick={() => handleViewBatch(selectedBatchId)}>
          <ViewIcon fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleEditBatch(selectedBatchId)}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem 
          onClick={() => handleDeleteClick(selectedBatchId)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Batch</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this batch? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
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

export default BatchList;