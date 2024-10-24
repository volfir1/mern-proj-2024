import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import  useProductManager  from '../../hooks/product';
import Sidebar from "../../components/sidebar/Sidebar";

const UpdateProduct = () => {
  const { productId } = useParams();
  const {
    formData,
    setFormData,
    imagePreview,
    errors,
    categories,
    subcategories,
    handleInputChange,
    handleImageChange,
    handleCategoryToggle,
    handleSubcategoryToggle,
    handleUpdateProduct,
    loadProductById,
    snackbar,
    handleCloseSnackbar,
    navigate
  } = useProductManager();

  const { data: product, isLoading } = loadProductById(productId);

  React.useEffect(() => {
    if (product) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        name: product.name || '',
        price: product.price || '',
        description: product.description || '',
        selectedCategories: product.categories || [],
        selectedSubcategories: product.subcategories || [],
        inStock: product.inStock || false,
        stockQuantity: product.stockQuantity || 0,
        image: product.image || ''
      }));
    }
  }, [product, setFormData]); // added setFormData to dependencies

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleUpdateProduct(productId);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar />
      <Box sx={{ p: 3, width: '100%', ml: '95px' }}>
        <Typography variant="h4" gutterBottom>
          Update Product
        </Typography>

        <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              {/* Product Name */}
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
                sx={{ mb: 2 }}
              />

              {/* Price */}
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                error={!!errors.price}
                helperText={errors.price}
                sx={{ mb: 2 }}
              />

              {/* Description */}
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                error={!!errors.description}
                helperText={errors.description}
                sx={{ mb: 2 }}
              />

              {/* Categories */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Categories</InputLabel>
                <Select
                  multiple
                  value={formData.selectedCategories}
                  onChange={(e) => handleCategoryToggle(e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const category = categories.find(cat => cat._id === value);
                        return (
                          <Chip 
                            key={value} 
                            label={category ? category.name : value} 
                            size="small" 
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Subcategories */}
              {subcategories.length > 0 && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Subcategories</InputLabel>
                  <Select
                    multiple
                    value={formData.selectedSubcategories}
                    onChange={(e) => handleSubcategoryToggle(e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                          const subcategory = subcategories.find(sub => sub._id === value);
                          return (
                            <Chip 
                              key={value} 
                              label={subcategory ? subcategory.name : value} 
                              size="small" 
                            />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {subcategories.map((subcategory) => (
                      <MenuItem key={subcategory._id} value={subcategory._id}>
                        {subcategory.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* Stock Management */}
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.inStock}
                      onChange={(e) => {
                        handleInputChange({
                          target: { name: 'inStock', value: e.target.checked }
                        });
                      }}
                      name="inStock"
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
                    error={!!errors.stockQuantity}
                    helperText={errors.stockQuantity}
                    sx={{ mt: 2 }}
                  />
                )}
              </Box>

              {/* Image Upload */}
              <Box sx={{ mb: 2 }}>
                <input
                  accept="image/*"
                  type="file"
                  id="image-upload"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="image-upload">
                  <Button variant="contained" component="span">
                    Upload New Image
                  </Button>
                </label>
                {errors.image && (
                  <Typography color="error" variant="caption" display="block" sx={{ mt: 1 }}>
                    {errors.image}
                  </Typography>
                )}
              </Box>

              {/* Image Preview */}
              {imagePreview && (
                <Box sx={{ mb: 2 }}>
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '200px',
                      objectFit: 'contain',
                      display: 'block',
                      marginTop: '8px'
                    }}
                  />
                </Box>
              )}

              {/* Error/Success Messages */}
              {snackbar.open && (
                <Alert 
                  severity={snackbar.severity} 
                  onClose={handleCloseSnackbar}
                  sx={{ mb: 2 }}
                >
                  {snackbar.message}
                </Alert>  
              )}

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/admin/products')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                >
                  Update Product
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default UpdateProduct;
