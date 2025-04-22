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
import { getCategoryBySlug, createCategory, updateCategory } from '../../services/productservice';

const generateSlug = (name) => {
  return name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
};

const CategoryForm = () => {
  const { slug } = useParams(); // Changed from 'id' to 'slug'
  const isEditMode = !!slug;
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    name: '',
    description: '',
    color: '#1E8A4C',
    slug: '',
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
  }, [slug]);

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const response = await getCategoryBySlug(slug);
      setCategory({
        name: response.name,
        description: response.description || '',
        color: response.color || '#1E8A4C',
        slug: response.slug || generateSlug(response.name),
      });
    } catch (error) {
      console.error('Error fetching category:', error);
      setSnackbar({
        open: true,
        message: `Failed to load category: ${error.response?.data?.detail || error.message}`,
        severity: 'error',
      });
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

    const updatedCategory = {
      ...category,
      slug: category.slug.trim() || generateSlug(category.name),
    };

    setLoading(true);
    try {
      if (isEditMode) {
        await updateCategory(slug, updatedCategory);
      } else {
        await createCategory(updatedCategory);
      }
      setSnackbar({
        open: true,
        message: `Category ${isEditMode ? 'updated' : 'created'} successfully`,
        severity: 'success',
      });
      setTimeout(() => navigate('/categories'), 1500);
    } catch (error) {
      console.error('Error saving category:', error);
      let errorMessage = `Failed to ${isEditMode ? 'update' : 'create'} category`;
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
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'name' && !prev.slug) {
        updated.slug = generateSlug(value);
      }
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
              <Box sx={{ mt: 2, position: 'relative', zIndex: 1 }}>
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