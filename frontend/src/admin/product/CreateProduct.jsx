import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
  useTheme,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useProductManager } from '../../hooks/productManager';
import useCategoryManager from '../../hooks/usecategoryManager';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ImageUploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.grey[300]}`,
  borderRadius: theme.shape.borderRadius,
  height: '100%',
  minHeight: 400,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  transition: theme.transitions.create(['border-color', 'box-shadow']),
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

const ProductForm = () => {
  const theme = useTheme();
  const { 
    categories, 
    handleCreateProduct, 
    loadCategories,
    snackbar,
    handleCloseSnackbar
  } = useProductManager();
  
  
  const { loadSubcategoriesByCategory } = useCategoryManager();  // New hook to load subcategories
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    subcategory: '',
    image: null,
    inStock: true,
    stockQuantity: '',
  });

  const [subcategories, setSubcategories] = useState([]);  // Subcategories state
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file' && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));

      // If category changes, reset subcategory and update subcategories list
      if (name === 'category') {
        setFormData(prev => ({ ...prev, subcategory: '' }));
        updateSubcategories(value);  // Load subcategories based on selected category
      }
    }
  };

  const handleStockToggle = (event) => {
    const checked = event.target.checked;
    setFormData(prev => ({
      ...prev,
      inStock: checked,
      stockQuantity: checked ? prev.stockQuantity : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = new FormData();
    for (const key in formData) {
      productData.append(key, formData[key]);
    }
    await handleCreateProduct(productData);
  };

  // Update the subcategories based on the selected category
  const updateSubcategories = async (categoryId) => {
    try {
      const subcategoriesList = await loadSubcategoriesByCategory(categoryId);  // Load from API
      setSubcategories(subcategoriesList || []);  // Set the subcategories
    } catch (error) {
      console.error("Failed to load subcategories", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: theme.palette.grey[100],
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom align="center" fontWeight="bold" color="primary">
            Create New Product
          </Typography>
          <Typography variant="body1" gutterBottom align="center" color="text.secondary" mb={4}>
            Add a new product to your inventory
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              {/* Image Upload */}
              <Grid item xs={12} md={6}>
                <ImageUploadBox
                  component="label"
                  htmlFor="image-upload"
                >
                  {imagePreview ? (
                    <Box
                      component="img"
                      src={imagePreview}
                      alt="Preview"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 1,
                      }}
                    />
                  ) : (
                    <>
                      <CameraAltIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="body1" color="text.secondary">
                        No image uploaded
                      </Typography>
                    </>
                  )}
                  <VisuallyHiddenInput
                    id="image-upload"
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                    accept="image/*"
                    required
                  />
                </ImageUploadBox>
                <Typography variant="caption" display="block" textAlign="center" mt={1}>
                  PNG, JPG up to 10MB
                </Typography>
              </Grid>

              {/* Form Fields */}
              <Grid item xs={12} md={6}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Product Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Category</InputLabel>
                      <Select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        label="Category"
                        required
                      >
                        {categories.map((category) => (
                          <MenuItem key={category._id} value={category._id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Subcategory</InputLabel>
                      <Select
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleInputChange}
                        label="Subcategory"
                        disabled={!formData.category}
                      >
                        {subcategories.map((subcategory) => (
                          <MenuItem key={subcategory._id} value={subcategory._id}>
                            {subcategory.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      multiline
                      rows={4}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.inStock}
                          onChange={handleStockToggle}
                          name="inStock"
                          color="primary"
                        />
                      }
                      label="In Stock"
                    />
                    {formData.inStock && (
                      <TextField
                        fullWidth
                        label="Stock Quantity"
                        name="stockQuantity"
                        type="number"
                        value={formData.stockQuantity}
                        onChange={handleInputChange}
                        required
                        variant="outlined"
                        sx={{ mt: 2 }}
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Box sx={{ mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{ py: 1.5, fontSize: '1.1rem' }}
              >
                Create Product
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductForm;
