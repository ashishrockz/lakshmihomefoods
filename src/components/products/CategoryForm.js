import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Divider,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon, ColorLens as ColorIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { SketchPicker } from 'react-color';
import { useNavigate, useParams } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import config from '../../config';

const CategoryForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const axios = useAxios();
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    name: '',
    description: '',
    color: '#1E8A4C',
  });
  const [loading, setLoading] = useState(false);
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (isEditMode) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.PRODUCTS.CATEGORIES}${id}/`);
      setCategory({
        name: response.data.name,
        description: response.data.description || '',
        color: response.data.color || '#1E8A4C',
      });
    } catch (error) {
      console.error('Error fetching category:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load category details',
        severity: 'error',
      });
      navigate('/categories');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleColorChange = (color) => {
    setCategory((prev) => ({
      ...prev,
      color: color.hex,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category.name.trim()) {
      setSnackbar({
        open: true,
        message: 'Category name is required',
        severity: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      if (isEditMode) {
        await axios.put(`${config.PRODUCTS.CATEGORIES}${id}/`, category);
      } else {
        await axios.post(config.PRODUCTS.CATEGORIES, category);
      }
      setSnackbar({
        open: true,
        message: `Category ${isEditMode ? 'updated' : 'created'} successfully`,
        severity: 'success',
      });
      setTimeout(() => navigate('/categories'), 1500);
    } catch (error) {
      console.error('Error saving category:', error);
      setSnackbar({
        open: true,
        message: `Failed to ${isEditMode ? 'update' : 'create'} category: ${
          error.response?.data?.detail || error.message
        }`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/categories');
  };

  if (loading && isEditMode) {
    return <Box sx={{ p: 3 }}>Loading category details...</Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleCancel} sx={{ mr: 2 }}>
          Back
        </Button>
        <Typography variant="h4">{isEditMode ? 'Edit Category' : 'Add New Category'}</Typography>
      </Box>

      <Paper sx={{ p: 4, maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Category Name"
            name="name"
            value={category.name}
            onChange={handleInputChange}
            fullWidth
            required
            disabled={loading}
            sx={{ mb: 3 }}
          />
          <TextField
            label="Description"
            name="description"
            value={category.description}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={3}
            disabled={loading}
            sx={{ mb: 3 }}
          />
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Category Color
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: category.color,
                  borderRadius: '4px',
                  mr: 2,
                  cursor: 'pointer',
                  border: '2px solid #e0e0e0',
                }}
                onClick={() => setOpenColorPicker(!openColorPicker)}
              />
              <Box>
                <Typography variant="body1">{category.color}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Click to change color
                </Typography>
              </Box>
              <IconButton
                onClick={() => setOpenColorPicker(!openColorPicker)}
                sx={{ ml: 'auto' }}
                color="primary"
                disabled={loading}
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
                <SketchPicker
                  color={category.color}
                  onChangeComplete={handleColorChange}
                  disableAlpha
                />
              </Box>
            )}
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              type="submit"
              disabled={loading || !category.name.trim()}
            >
              {loading ? 'Saving...' : isEditMode ? 'Update Category' : 'Create Category'}
            </Button>
          </Box>
        </form>
      </Paper>

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

export default CategoryForm;