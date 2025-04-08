import React, { useState, useEffect } from "react";
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
  CardContent,
  Snackbar,
  Alert,
  InputAdornment,
  Tooltip,
  Chip,
  LinearProgress,
  Container,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon,
  PhotoCamera as PhotoCameraIcon,
  Help as HelpIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import { getAllCategories, getProductById, createProduct, updateProduct } from "../../services/productservice.js"; // Updated imports

const ProductForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    active: true,
    low_stock_threshold: 10,
    image_url: "",
    variants: [{ size: "", weight: "", price_adjustment: 0 }],
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories(); // Updated call
      setCategories(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
      setSnackbar({
        open: true,
        message: "Failed to load categories",
        severity: "error",
      });
    }
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const productData = await getProductById(id); // Updated call
      setProduct({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category_id: productData.category.id,
        active: productData.active,
        low_stock_threshold: productData.low_stock_threshold,
        image_url: productData.image_url,
        variants:
          productData.variants && productData.variants.length > 0
            ? productData.variants.map((v) => ({
                id: v.id,
                size: v.size,
                weight: v.weight,
                price_adjustment: v.price_adjustment,
              }))
            : [{ size: "", weight: "", price_adjustment: 0 }],
      });
      setImagePreview(productData.image_url);
    } catch (error) {
      console.error("Error fetching product:", error);
      setSnackbar({
        open: true,
        message: "Failed to load product details",
        severity: "error",
      });
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...product.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value,
    };
    setProduct({
      ...product,
      variants: updatedVariants,
    });
  };

  const handleAddVariant = () => {
    setProduct({
      ...product,
      variants: [
        ...product.variants,
        { size: "", weight: "", price_adjustment: 0 },
      ],
    });
  };

  const handleRemoveVariant = (index) => {
    if (product.variants.length === 1) return;
    const updatedVariants = product.variants.filter((_, i) => i !== index);
    setProduct({
      ...product,
      variants: updatedVariants,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview("");
    setProduct({
      ...product,
      image_url: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.name || !product.price || !product.category_id) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields",
        severity: "error",
      });
      return;
    }

    setSubmitLoading(true);
    try {
      const productData = {
        name: product.name,
        description: product.description,
        price: product.price,
        category_id: product.category_id,
        active: product.active,
        low_stock_threshold: product.low_stock_threshold,
        variants: product.variants,
      };
      if (imageFile) {
        productData.image = imageFile;
      }

      if (isEditMode) {
        await updateProduct(id, productData); // Updated call
      } else {
        await createProduct(productData); // Updated call
      }

      setSnackbar({
        open: true,
        message: `Product ${isEditMode ? "updated" : "created"} successfully`,
        severity: "success",
      });
      setTimeout(() => navigate("/products"), 1500);
    } catch (error) {
      console.error("Error saving product:", error);
      setSnackbar({
        open: true,
        message: `Failed to ${isEditMode ? "update" : "create"} product: ${
          error.response?.data?.message || "Unknown error"
        }`,
        severity: "error",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/products");
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Loading product details...</Typography>
          <LinearProgress sx={{ width: "80%" }} />
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link component={RouterLink} to="/" color="inherit">Dashboard</Link>
          <Link component={RouterLink} to="/products" color="inherit">Products</Link>
          <Typography color="text.primary">{isEditMode ? "Edit Product" : "Add New Product"}</Typography>
        </Breadcrumbs>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleCancel} sx={{ mr: 2 }}>
            Back to Products
          </Button>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>{isEditMode ? "Edit Product" : "Add New Product"}</Typography>
          {isEditMode && (
            <Chip label={product.active ? "Active" : "Inactive"} color={product.active ? "success" : "default"} sx={{ ml: 2 }} />
          )}
        </Box>
      </Box>

      {submitLoading && <LinearProgress sx={{ mb: 3 }} />}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }} elevation={2}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>Product Information</Typography>
                <Tooltip title="Fill in the basic product details here">
                  <IconButton size="small" sx={{ ml: 1 }}><InfoIcon fontSize="small" /></IconButton>
                </Tooltip>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Product Name"
                    name="name"
                    value={product.name}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    variant="outlined"
                    placeholder="Enter product name"
                    helperText="The name of your product as it will appear to customers"
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
                    placeholder="Describe your product"
                    helperText="Provide a detailed description of your product"
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
                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                    placeholder="0.00"
                    helperText="Base price before variant adjustments"
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
                      startAdornment={<InputAdornment position="start"><CategoryIcon fontSize="small" /></InputAdornment>}
                    >
                      {!Array.isArray(categories) || categories.length === 0 ? (
                        <MenuItem disabled value="">No categories available</MenuItem>
                      ) : (
                        categories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                        ))
                      )}
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
                    InputProps={{
                      endAdornment: (
                        <Tooltip title="You'll be notified when stock falls below this number">
                          <InputAdornment position="end"><HelpIcon fontSize="small" color="action" /></InputAdornment>
                        </Tooltip>
                      ),
                    }}
                    helperText="Trigger low stock alerts at this quantity"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
                    <FormControlLabel
                      control={<Switch checked={product.active} onChange={handleInputChange} name="active" color="primary" />}
                      label={
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography variant="body1">{product.active ? "Active" : "Inactive"}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {product.active ? "Product is visible to customers" : "Product is hidden from customers"}
                          </Typography>
                        </Box>
                      }
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            <Paper sx={{ p: 3, borderRadius: 2 }} elevation={2}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>Product Variants</Typography>
                  <Tooltip title="Add size, weight or other variations with different pricing">
                    <IconButton size="small" sx={{ ml: 1 }}><InfoIcon fontSize="small" /></IconButton>
                  </Tooltip>
                </Box>
                <Button startIcon={<AddIcon />} onClick={handleAddVariant} size="small" variant="contained" color="secondary">
                  Add Variant
                </Button>
              </Box>
              <Divider sx={{ mb: 3 }} />
              {product.variants.map((variant, index) => (
                <Paper
                  key={index}
                  elevation={1}
                  sx={{ mb: 3, p: 2, borderRadius: 1, position: "relative", transition: "all 0.2s", "&:hover": { boxShadow: 3 } }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>Variant {index + 1}</Typography>
                    {product.variants.length > 1 && (
                      <Tooltip title="Remove this variant">
                        <IconButton size="small" onClick={() => handleRemoveVariant(index)} color="error" sx={{ p: 0.5 }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Size"
                        value={variant.size}
                        onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                        fullWidth
                        variant="outlined"
                        placeholder="e.g., Small, Medium, Large"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Weight"
                        value={variant.weight}
                        onChange={(e) => handleVariantChange(index, "weight", e.target.value)}
                        fullWidth
                        variant="outlined"
                        placeholder="e.g., 16oz, 32oz"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Price Adjustment"
                        type="number"
                        value={variant.price_adjustment}
                        onChange={(e) => handleVariantChange(index, "price_adjustment", e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        size="small"
                        helperText={
                          variant.price_adjustment > 0
                            ? `Final: $${(Number(product.price || 0) + Number(variant.price_adjustment)).toFixed(2)}`
                            : ""
                        }
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}
              {product.variants.length === 0 && (
                <Box sx={{ textAlign: "center", py: 3 }}>
                  <Typography variant="body2" color="text.secondary">No variants added yet</Typography>
                  <Button startIcon={<AddIcon />} onClick={handleAddVariant} sx={{ mt: 1 }}>Add First Variant</Button>
                </Box>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }} elevation={2}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>Product Image</Typography>
              <Divider sx={{ mb: 3 }} />
              <Box
                sx={{
                  width: "100%",
                  height: 240,
                  border: "2px dashed",
                  borderColor: imagePreview ? "transparent" : "divider",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                  overflow: "hidden",
                  position: "relative",
                  bgcolor: imagePreview ? "transparent" : "action.hover",
                  transition: "all 0.2s",
                  "&:hover": { borderColor: imagePreview ? "transparent" : "primary.main" },
                  "&:hover .image-overlay": { opacity: 1 },
                }}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Product" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    <Box
                      className="image-overlay"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.3s",
                      }}
                    >
                      <Box>
                        <Button variant="contained" component="label" startIcon={<PhotoCameraIcon />} sx={{ mr: 1 }} size="small">
                          Change
                          <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                        </Button>
                        <Button variant="contained" color="error" onClick={handleImageRemove} startIcon={<DeleteIcon />} size="small">
                          Remove
                        </Button>
                      </Box>
                    </Box>
                  </>
                ) : (
                  <>
                    <PhotoCameraIcon fontSize="large" color="action" sx={{ mb: 1, opacity: 0.7 }} />
                    <Typography variant="body2" color="text.secondary" align="center">
                      Drag & drop an image here or click to browse
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Recommended size: 800 x 800 pixels
                    </Typography>
                    <Button variant="outlined" component="label" sx={{ mt: 2 }} size="small">
                      Browse Files
                      <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                    </Button>
                  </>
                )}
              </Box>
              {imageFile && (
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                  Selected file: {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
                </Typography>
              )}
            </Paper>
            <Card sx={{ mb: 3, borderRadius: 2 }} elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", display: "flex", alignItems: "center" }}>
                  Product Preview
                  <Tooltip title="This is how your product will appear to customers">
                    <IconButton size="small" sx={{ ml: 1 }}><InfoIcon fontSize="small" /></IconButton>
                  </Tooltip>
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box
                  sx={{
                    borderRadius: 1,
                    overflow: "hidden",
                    height: 180,
                    bgcolor: "grey.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Product" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                  ) : (
                    <Typography variant="body2" color="text.secondary">No image uploaded</Typography>
                  )}
                </Box>
                <Typography variant="subtitle1" fontWeight="bold">{product.name || "Product Name"}</Typography>
                {product.category_id && categories.length > 0 && (
                  <Chip
                    label={categories.find((c) => c.id === product.category_id)?.name || "Category"}
                    size="small"
                    sx={{ mt: 0.5, mb: 1 }}
                  />
                )}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxHeight: 60, overflow: "hidden", textOverflow: "ellipsis" }}>
                  {product.description
                    ? product.description.length > 100
                      ? product.description.substring(0, 100) + "..."
                      : product.description
                    : "Product description will appear here"}
                </Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">${Number(product.price || 0).toFixed(2)}</Typography>
                {product.variants.some((v) => v.size || v.weight) && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">Available options:</Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
                      {product.variants.map((v, i) => {
                        if (!v.size && !v.weight) return null;
                        return (
                          <Chip
                            key={i}
                            label={[v.size, v.weight].filter(Boolean).join(" - ")}
                            size="small"
                            variant="outlined"
                          />
                        );
                      })}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="outlined" color="inherit" startIcon={<CancelIcon />} fullWidth onClick={handleCancel} size="large">
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                fullWidth
                type="submit"
                disabled={submitLoading}
                size="large"
              >
                {submitLoading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Product" : "Create Product")}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductForm;