import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Snackbar,
  Alert,
  InputAdornment
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import config from '../../config';

const ProductForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    active: true,
    low_stock_threshold: 10,
    image_url: '',
    variants: [
      { size: '', weight: '', price_adjustment: 0 }
    ]
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const axios = useAxios();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchCategories();
    
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);
  
  const fetchCategories = async () => {
    try {
      const response = await axios.get(config.PRODUCTS.CATEGORIES);
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load categories',
        severity: 'error'
      });
    }
  };
  
  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.PRODUCTS.ALL}${id}/`);
      
      setProduct({
        name: response.data.name,
        description: response.data.description,
        price: response.data.price,
        category_id: response.data.category.id,
        active: response.data.active,
        low_stock_threshold: response.data.low_stock_threshold,
        image_url: response.data.image_url,
        variants: response.data.variants && response.data.variants.length > 0 
          ? response.data.variants.map(v => ({
              id: v.id,
              size: v.size,
              weight: v.weight,
              price_adjustment: v.price_adjustment
            }))
          : [{ size: '', weight: '', price_adjustment: 0 }]
      });
      
      setImagePreview(response.data.image_url);
    } catch (error) {
      console.error('Error fetching product:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load product details',
        severity: 'error'
      });
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...product.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value
    };
    
    setProduct({
      ...product,
      variants: updatedVariants
    });
  };
  
  const handleAddVariant = () => {
    setProduct({
      ...product,
      variants: [
        ...product.variants,
        { size: '', weight: '', price_adjustment: 0 }
      ]
    });
  };
  
  const handleRemoveVariant = (index) => {
    if (product.variants.length === 1) return;
    
    const updatedVariants = product.variants.filter((_, i) => i !== index);
    setProduct({
      ...product,
      variants: updatedVariants
    });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview('');
    setProduct({
      ...product,
      image_url: ''
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!product.name || !product.price || !product.category_id) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }
    
    setSubmitLoading(true);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('price', product.price);
      formData.append('category_id', product.category_id);
      formData.append('active', product.active);
      formData.append('low_stock_threshold', product.low_stock_threshold);
      formData.append('variants', JSON.stringify(product.variants));
      
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      let response;
      
      if (isEditMode) {
        response = await axios.put(`${config.PRODUCTS.ALL}${id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axios.post(config.PRODUCTS.ALL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      setSnackbar({
        open: true,
        message: `Product ${isEditMode ? 'updated' : 'created'} successfully`,
        severity: 'success'
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (error) {
      console.error('Error saving product:', error);
      setSnackbar({
        open: true,
        message: `Failed to ${isEditMode ? 'update' : 'create'} product`,
        severity: 'error'
      });
    } finally {
      setSubmitLoading(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/products');
  };
  
  if (loading) {
    return <Box sx={{ p: 3 }}>Loading product details...</Box>;
  }
  
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleCancel}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        
        <Typography variant="h4">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </Typography>
      </Box>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Product Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Product Name"
                    name="name"
                    value={product.name}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    name="description"
                    value={product.description}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Price"
                    name="price"
                    type="number"
                    value={product.price}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    variant="outlined"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category_id"
                      value={product.category_id}
                      onChange={handleInputChange}
                      label="Category"
                    >
                      {categories.map(category => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Low Stock Threshold"
                    name="low_stock_threshold"
                    type="number"
                    value={product.low_stock_threshold}
                    onChange={handleInputChange}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={product.active}
                        onChange={handleInputChange}
                        name="active"
                        color="primary"
                      />
                    }
                    label="Active"
                  />
                </Grid>
              </Grid>
            </Paper>
            
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Product Variants
                </Typography>
                
                <Button 
                  startIcon={<AddIcon />}
                  onClick={handleAddVariant}
                  size="small"
                  variant="outlined"
                >
                  Add Variant
                </Button>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              {product.variants.map((variant, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    mb: 3, 
                    p: 2, 
                    border: '1px solid #eee', 
                    borderRadius: 1,
                    position: 'relative'
                  }}
                >
                  {product.variants.length > 1 && (
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveVariant(index)}
                      sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8,
                        color: 'error.main'
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                  
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Size"
                        value={variant.size}
                        onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                        fullWidth
                        variant="outlined"
                        placeholder="e.g., Small, Medium, Large"
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Weight"
                        value={variant.weight}
                        onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
                        fullWidth
                        variant="outlined"
                        placeholder="e.g., 16oz, 32oz"
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Price Adjustment"
                        type="number"
                        value={variant.price_adjustment}
                        onChange={(e) => handleVariantChange(index, 'price_adjustment', e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Product Image
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box 
                sx={{ 
                  width: '100%',
                  height: 200,
                  border: '2px dashed #ccc',
                  borderRadius: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  overflow: 'hidden',
                  position: 'relative',
                  '&:hover .image-overlay': {
                    opacity: 1
                  }
                }}
              >
                {imagePreview ? (
                  <>
                    <img 
                      src={imagePreview} 
                      alt="Product" 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                    />
                    <Box 
                      className="image-overlay"
                      sx={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.2s'
                      }}
                    >
                      <IconButton 
                        color="error" 
                        onClick={handleImageRemove}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </>
                ) : (
                  <>
                    <UploadIcon fontSize="large" color="disabled" sx={{ mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Drag & drop or click to upload
                    </Typography>
                  </>
                )}
              </Box>
              
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                fullWidth
              >
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
            </Paper>
            
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Product Preview
                </Typography>
                
                <Box 
                  sx={{ 
                    borderRadius: 1,
                    overflow: 'hidden',
                    height: 150,
                    bgcolor: 'grey.100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Product" 
                      style={{ maxWidth: '100%', maxHeight: '100%' }} 
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No image
                    </Typography>
                  )}
                </Box>
                
                <Typography variant="subtitle1" fontWeight="bold">
                  {product.name || 'Product Name'}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {product.description 
                    ? (product.description.length > 100 
                      ? product.description.substring(0, 100) + '...' 
                      : product.description)
                    : 'Product description will appear here'}
                </Typography>
                
                <Typography variant="h6" color="primary" fontWeight="bold">
                  ${Number(product.price || 0).toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                fullWidth
                onClick={handleCancel}
              >
                Cancel
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                fullWidth
                type="submit"
                disabled={submitLoading}
              >
                {submitLoading 
                  ? (isEditMode ? 'Updating...' : 'Creating...') 
                  : (isEditMode ? 'Update Product' : 'Create Product')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
      
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

export default ProductForm;