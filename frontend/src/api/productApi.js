import axiosInstance from '../utils/api'; // Adjust the path accordingly

// Helper function for handling response
const handleResponse = (response) => {
  if (response.status >= 400) {
    throw new Error(`Failed to fetch data: ${response.statusText}. ${response.data}`);
  }
  return response.data;
};

// Product API calls
export const fetchProducts = async () => {
  try {
    const response = await axiosInstance.get('/products', { timeout: 10000 }); // 10 seconds timeout
    return handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }
};

export const fetchCategories = async () => {
  try {
    const response = await axiosInstance.get('/categories', { timeout: 10000 }); // 10 seconds timeout
    return handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }
};

export const fetchSubcategoriesByCategory = async (categoryId) => {
  try {
    const response = await axiosInstance.get(`/categories/${categoryId}/subcategories`, { timeout: 10000 }); // 10 seconds timeout
    return handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to fetch subcategories: ${error.message}`);
  }
};

export const createProduct = async (productData) => {
  try {
    const isFormData = productData instanceof FormData;
    const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
    const response = await axiosInstance.post('/products', productData, { headers, timeout: 10000 }); // 10 seconds timeout
    return handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to create product: ${error.message}`);
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    if (!productId) throw new Error('Product ID is required');
    const isFormData = productData instanceof FormData;
    const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
    const response = await axiosInstance.put(`/products/${productId}`, productData, { headers, timeout: 10000 }); // 10 seconds timeout
    return handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to update product: ${error.message}`);
  }
};

export const deleteProduct = async (productId, publicId) => {
  try {
    if (!productId) throw new Error('Product ID is required');
    const headers = publicId ? { 'Content-Type': 'application/json', 'Public-Id': publicId } : { 'Content-Type': 'application/json' };
    const response = await axiosInstance.delete(`/products/${productId}`, { headers, timeout: 10000 }); // 10 seconds timeout
    return handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to delete product: ${error.message}`);
  }
};

// Validate file before upload
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'],
  } = options;

  if (!file) {
    throw new Error('No file provided');
  }

  if (file.size > maxSize) {
    throw new Error(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type must be one of: ${allowedTypes.join(', ')}`);
  }

  return true;
};

// Upload product image
export const uploadProductImage = async (imageFile) => {
  try {
    validateFile(imageFile);

    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await axiosInstance.post('/upload', formData, { timeout: 10000 }); // 10 seconds timeout
    return handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};
