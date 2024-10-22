import axiosInstance from '../utils/api'; // Adjust the path accordingly

const handleResponse = (response) => {
  if (response.status >= 400) {
    throw new Error(`Failed to fetch data: ${response.statusText}. ${response.data}`);
  }
  return response.data;
};

const handleError = (error, action) => {
  throw new Error(`Failed to ${action}: ${error.message}`);
};

const jsonHeaders = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Category API calls
export const fetchCategories = async () => {
  try {
    const response = await axiosInstance.get('/categories');
    return handleResponse(response);
  } catch (error) {
    handleError(error, 'fetch categories');
  }
};


export const getCategoryById = async (id) => {
  try {
    const response = await axiosInstance.get(`/categories/${id}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error, 'fetch category by ID');
  }
};

export const createCategory = async (category) => {
  try {
    const response = await axiosInstance.post('/categories', category, jsonHeaders);
    return handleResponse(response);
  } catch (error) {
    handleError(error, 'create category');
  }
};

export const updateCategory = async (id, category) => {
  try {
    const response = await axiosInstance.put(`/categories/${id}`, category, jsonHeaders);
    return handleResponse(response);
  } catch (error) {
    handleError(error, 'update category');
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error, 'delete category');
  }
};

// Subcategory API calls
export const createSubcategory = async (categoryId, subcategories) => {
  try {
    const response = await axiosInstance.post(`/categories/${categoryId}/subcategories`, { subcategories }, jsonHeaders);
    return handleResponse(response);
  } catch (error) {
    handleError(error, 'create subcategory');
  }
};

export const updateSubcategory = async (categoryId, subcategoryId, subcategory) => {
  try {
    const response = await axiosInstance.put(`/categories/${categoryId}/subcategory/${subcategoryId}`, subcategory, jsonHeaders);
    return handleResponse(response);
  } catch (error) {
    handleError(error, 'update subcategory');
  }
};

export const deleteSubcategory = async (categoryId, subcategoryId) => {
  try {
    const response = await axiosInstance.delete(`/categories/${categoryId}/subcategory/${subcategoryId}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error, 'delete subcategory');
  }
};

export const getSubcategoriesByCategory = async (categoryId) => {
  try {
    const response = await axiosInstance.get(`/categories/${categoryId}/subcategories`);
    return handleResponse(response);
  } catch (error) {
    handleError(error, 'fetch subcategories by category');
  }
};
