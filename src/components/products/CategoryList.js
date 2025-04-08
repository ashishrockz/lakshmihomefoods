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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, ColorLens as ColorIcon } from '@mui/icons-material';
import { SketchPicker } from 'react-color';
import useAxios from '../../hooks/useAxios';
import config from '../../config';
import { useNavigate } from 'react-router-dom';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    color: '#1E8A4C',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const axios = useAxios();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(config.PRODUCTS.CATEGORIES);
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load categories',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category = null) => {
    if (category) {
      setSelectedCategory(category);
      setFormValues({
        name: category.name,
        description: category.description || '',
        color: category.color || '#1E8A4C',
      });
    } else {
      setSelectedCategory(null);
      setFormValues({
        name: '',
        description: '',
        color: '#1E8A4C',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOpenColorPicker(false);
    setSelectedCategory(null);
  };

  const handleOpenDeleteDialog = (category) => {
    setSelectedCategory(category);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedCategory(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleColorChange = (color) => {
    setFormValues((prev) => ({
      ...prev,
      color: color.hex,
    }));
  };

  const handleSubmit = async () => {
    if (!formValues.name.trim()) {
      setSnackbar({
        open: true,
        message: 'Category name is required',
        severity: 'error',
      });
      return;
    }

    try {
      if (selectedCategory) {
        await axios.put(`${config.PRODUCTS.CATEGORIES}${selectedCategory.id}/`, formValues);
        setSnackbar({
          open: true,
          message: 'Category updated successfully',
          severity: 'success',
        });
      } else {
        await axios.post(config.PRODUCTS.CATEGORIES, formValues);
        setSnackbar({
          open: true,
          message: 'Category created successfully',
          severity: 'success',
        });
      }
      handleCloseDialog();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      setSnackbar({
        open: true,
        message: `Failed to ${selectedCategory ? 'update' : 'create'} category: ${
          error.response?.data?.detail || error.message
        }`,
        severity: 'error',
      });
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${config.PRODUCTS.CATEGORIES}${selectedCategory.id}/`);
      setSnackbar({
        open: true,
        message: 'Category deleted successfully',
        severity: 'success',
      });
      handleCloseDeleteDialog();
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      let errorMessage = 'Failed to delete category';
      if (error.response?.data?.detail?.includes('foreign key constraint')) {
        errorMessage = 'Cannot delete this category because it is used by existing products';
      }
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
      handleCloseDeleteDialog();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Categories</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Category
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Color</TableCell>
                <TableCell>Products</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description || 'N/A'}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: category.color || '#1E8A4C',
                            borderRadius: '50%',
                            mr: 1,
                          }}
                        />
                        {category.color || 'N/A'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={category.product_count || 0} color="primary" size="small" />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => navigate(`/categories/edit/${category.id}`)} // Changed to navigate to CategoryForm
                        sx={{ mr: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleOpenDeleteDialog(category)}
                        disabled={category.product_count > 0}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <TextField
              label="Category Name"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              fullWidth
              required
              sx={{ mb: 3 }}
            />
            <TextField
              label="Description"
              name="description"
              value={formValues.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={2}
              sx={{ mb: 3 }}
            />
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Category Color
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: formValues.color,
                    borderRadius: '4px',
                    mr: 2,
                    cursor: 'pointer',
                    border: '2px solid #e0e0e0',
                  }}
                  onClick={() => setOpenColorPicker(!openColorPicker)}
                />
                <Typography variant="body2">{formValues.color}</Typography>
                <IconButton
                  size="small"
                  onClick={() => setOpenColorPicker(!openColorPicker)}
                  sx={{ ml: 1 }}
                >
                  <ColorIcon />
                </IconButton>
              </Box>
              {openColorPicker && (
                <Box sx={{ mt: 2, position: 'absolute', zIndex: 1 }}>
                  <Box
                    sx={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0 }}
                    onClick={() => setOpenColorPicker(false)}
                  />
                  <SketchPicker color={formValues.color} onChangeComplete={handleColorChange} />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!formValues.name.trim()}>
            {selectedCategory ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the category "{selectedCategory?.name}"? This action cannot be undone.
          </Typography>
          {selectedCategory?.product_count > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This category has {selectedCategory.product_count} products associated with it. You need to reassign
              these products before deleting this category.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error" disabled={selectedCategory?.product_count > 0}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoryList;