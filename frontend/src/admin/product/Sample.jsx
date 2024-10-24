import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Switch,
  FormControlLabel,
  CircularProgress,
  Checkbox,
  FormGroup,
} from '@mui/material';
import SnackbarMessage from '../../components/alert/Snackbar';
import useProductManager from '../../hooks/product';

const CreateProductForm = () => {
  const {
    formData = {},
    setFormData, // Added to update form data
    errors = {},
    isSubmitting,
    categories = [],
    subcategories = [],
    imagePreview,
    handleImageChange,
    handleCategoryToggle,
    handleSubcategoryToggle,
    loading,
    navigate,
    snackbar,
    handleCloseSnackbar,
  } = useProductManager();

  const [localErrors, setLocalErrors] = useState({}); // State for local validation errors

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Product name is required.';
    if (!formData.price) newErrors.price = 'Price is required.';
    if (formData.inStock && !formData.stockQuantity) {
      newErrors.stockQuantity = 'Stock quantity is required if product is in stock.';
    }
    if (!formData.description) newErrors.description = 'Description is required.';
    if (!formData.selectedCategories || formData.selectedCategories.length === 0) {
      newErrors.categories = 'At least one category is required.';
    }
    if (!formData.selectedSubcategories || formData.selectedSubcategories.length === 0) {
      newErrors.subcategories = 'At least one subcategory is required.';
    }
    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!validateForm()) return; // Validate the form before submission

    // Call the API to create the product
    // Replace the following comment with your API call logic
    console.log('Submitting product data:', formData);

   
  };

  return (
    <>
     <SnackbarMessage
  open={snackbar.open}
  onClose={() => dispatch({ type: 'CLOSE_SNACKBAR' })} // Close the Snackbar
  message={snackbar.message}
  severity={snackbar.severity}
/>

      <div className="container mx-auto p-6 bg-white rounded-lg shadow-md max-w-6xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Create New Product</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Inputs and Description */}
          <div className="space-y-4">
            {/* Product Name */}
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              error={!!localErrors.name}
              helperText={localErrors.name}
            />

            {/* Product Price */}
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price || ''}
              onChange={handleInputChange}
              error={!!localErrors.price}
              helperText={localErrors.price}
            />

            {/* In Stock Switch */}
            <FormControlLabel
              control={
                <Switch
                  checked={!!formData.inStock}
                  onChange={() =>
                    handleInputChange({
                      target: { name: 'inStock', value: !formData.inStock },
                    })
                  }
                  color="primary"
                />
              }
              label="In Stock"
            />

            {/* Stock Quantity (only shown if in stock) */}
            {formData.inStock && (
              <TextField
                fullWidth
                label="Stock Quantity"
                name="stockQuantity"
                type="number"
                value={formData.stockQuantity || ''}
                onChange={handleInputChange}
                error={!!localErrors.stockQuantity}
                helperText={localErrors.stockQuantity}
              />
            )}

            {/* Product Description */}
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <TextField
                fullWidth
                label="Product Description"
                name="description"
                multiline
                rows={4}
                value={formData.description || ''}
                onChange={handleInputChange}
                error={!!localErrors.description}
                helperText={localErrors.description}
                className="mb-4"
              />
            </div>
          </div>

          {/* Right Column: Image Preview and Categories */}
          <div className="space-y-4">
            {/* Image Upload */}
            <div
              className="relative group cursor-pointer"
              onClick={() => document.getElementById('image-upload').click()}
            >
              <div className="w-full h-64 bg-gray-100 flex items-center justify-center border border-dashed border-gray-300 rounded-lg hover:bg-gray-200">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Product Preview"
                    className="object-cover h-full w-full rounded-lg"
                  />
                ) : (
                  <p className="text-gray-500 group-hover:text-gray-700">Click to upload image</p>
                )}
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleImageChange}
              />
              {errors.image && <p className="text-red-500 mt-2">{errors.image}</p>}
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-semibold mb-2">Categories</h4>
              <FormGroup>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <FormControlLabel
                      key={category._id}
                      control={
                        <Checkbox
                          checked={formData.selectedCategories?.includes(category._id)}
                          onChange={() => handleCategoryToggle(category._id)}
                          color="primary"
                        />
                      }
                      label={category.name}
                    />
                  ))
                ) : (
                  <p className="text-gray-500">No categories available</p>
                )}
              </FormGroup>
              {localErrors.categories && (
                <p className="text-red-500 mt-1">{localErrors.categories}</p>
              )}
            </div>

            {/* Subcategories */}
            <div>
              <h4 className="font-semibold mb-2">Subcategories</h4>
              <FormGroup>
                {subcategories.length > 0 ? (
                  subcategories.map((subcategory) => (
                    <FormControlLabel
                      key={subcategory._id}
                      control={
                        <Checkbox
                          checked={formData.selectedSubcategories?.includes(subcategory._id)}
                          onChange={() => handleSubcategoryToggle(subcategory._id)}
                          color="primary"
                        />
                      }
                      label={subcategory.name}
                    />
                  ))
                ) : (
                  <p className="text-gray-500">No subcategories available</p>
                )}
              </FormGroup>
              {localErrors.subcategories && (
                <p className="text-red-500 mt-1">{localErrors.subcategories}</p>
              )}
            </div>
          </div>

          {/* Submit and Cancel buttons */}
          <div className="col-span-2 flex justify-end space-x-4 mt-6">
            <Button
              onClick={() => navigate('/admin/products')}
              variant="outlined"
              color="secondary"
              className="bg-gray-100 hover:bg-gray-200 text-gray-600"
            >
              Cancel
            </Button>

            <Button
              type="submit" // Keep this as 'submit' to trigger the form submission
              variant="contained"
              color="primary"
              disabled={isSubmitting || loading}
              startIcon={loading && <CircularProgress size={20} />}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isSubmitting ? 'Submitting...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateProductForm;
