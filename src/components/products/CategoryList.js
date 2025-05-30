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
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ColorLens as ColorIcon,
} from '@mui/icons-material';
import { SketchPicker } from 'react-color';
import { useNavigate } from 'react-router-dom';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../../services/productservice.js';

const generateSlug = (name) => {
  return name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
};

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
    slug: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getAllCategories();
      setCategories(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
      setSnackbar({
        open: true,
        message: `Failed to load categories: ${error.response?.data?.detail || error.message}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category = null) => {
    setSelectedCategory(category);
    setFormValues({
      name: category?.name || '',
      description: category?.description || '',
      color: category?.color || '#1E8A4C',
      slug: category?.slug || '',
    });
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
    setFormValues((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'name' && !prev.slug) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
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

    const categoryData = {
      ...formValues,
      slug: formValues.slug.trim() || generateSlug(formValues.name),
    };

    try {
      if (selectedCategory) {
        await updateCategory(selectedCategory.slug, categoryData);
        setSnackbar({
          open: true,
          message: 'Category updated successfully',
          severity: 'success',
        });
      } else {
        await createCategory(categoryData);
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
      let errorMessage = `Failed to ${selectedCategory ? 'update' : 'create'} category`;
      if (error.response?.data?.slug) {
        errorMessage = 'Slug already exists. Please choose a different name or slug.';
      } else {
        errorMessage = error.response?.data?.detail || error.message;
      }
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(selectedCategory.slug);
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
      } else {
        errorMessage = error.response?.data?.detail || error.message;
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/categories/new')}
        >
          Add Category
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Color</TableCell>
                <TableCell>Products</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : !Array.isArray(categories) || categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.slug} hover>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
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
                        {category.color}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={category.product_count || 0} color="primary" size="small" />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => navigate(`/categories/edit/${category.slug}`)}
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
              label="Slug (URL-friendly name)"
              name="slug"
              value={formValues.slug}
              onChange={handleInputChange}
              fullWidth
              helperText="Auto-generated from name, but you can customize it"
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
                <Box sx={{ mt: 2, position: 'relative', zIndex: 1 }}>
                  <Box
                    sx={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0 }}
                    onClick={() => setOpenColorPicker(false)}
                  />
                  <SketchPicker
                    color={formValues.color}
                    onChangeComplete={handleColorChange}
                    disableAlpha
                  />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formValues.name.trim()}
          >
            {selectedCategory ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the category "{selectedCategory?.name}"? This action cannot be undone.
          </Typography>
          {selectedCategory?.product_count > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This category has {selectedCategory.product_count} products. You must reassign or delete them first.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={selectedCategory?.product_count > 0}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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