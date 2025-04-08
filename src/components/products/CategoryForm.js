import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  ColorLens as ColorIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { SketchPicker } from 'react-color';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategoryById, createCategory, updateCategory } from '../../services/productservice.js'; // Updated imports

const generateSlug = (name) => {
  return name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
};

const CategoryForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    name: '',
    description: '',
    color: '#1E8A4C',
    slug: ''
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
      const response = await getCategoryById(id); // Updated call
      setCategory({
        name: response.name,
        description: response.description || '',
        color: response.color || '#1E8A4C',
        slug: response.slug || '',
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

    if (!category.slug.trim()) {
      category.slug = generateSlug(category.name);
    }

    const categoryData = {
      name: category.name,
      description: category.description,
      color: category.color,
      slug: category.slug
    };

    setLoading(true);
    try {
      if (isEditMode) {
        await updateCategory(id, categoryData); // Updated call
      } else {
        await createCategory(categoryData); // Updated call
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
        message: `Failed to ${isEditMode ? 'update' : 'create'} category: ${error.response?.data?.detail || error.message}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'name') updated.slug = generateSlug(value);
      return updated;
    });
  };

  const handleColorChange = (color) => {
    setCategory((prev) => ({ ...prev, color: color.hex }));
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
            label="Slug (URL-friendly name)"
            name="slug"
            value={category.slug}
            onChange={handleInputChange}
            fullWidth
            disabled={loading}
            helperText="Auto-generated from name, but you can customize it"
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
              <Box sx={{ mt: 2 }}>
                <SketchPicker
                  color={category.color}
                  onChange={handleColorChange}
                  disableAlpha
                />
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={loading}
            >
              {isEditMode ? 'Update' : 'Create'}
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancel}
              startIcon={<CancelIcon />}
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoryForm;
