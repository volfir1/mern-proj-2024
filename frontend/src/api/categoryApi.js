import axios from 'axios';

const handleResponse = (response) => {
  if (response.status >= 400) {
    throw new Error(`Failed to fetch data: ${response.statusText}. ${response.data}`);
  }
  return response.data;
};

// Category API calls
export const fetchCategories = async () => {
  try {
    const response = await axios.get('/api/categories');
    return handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }
};

export const getCategoryById = async (id) => {
  try {
    const response = await axios.get(`/api/categories/${id}`);
    return handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to fetch category by ID: ${error.message}`);
  }
};

export const createCategory = async (category) => {
  try {
    const response = await axios.post('/api/categories', category, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to create category: ${error.message}`);
  }
};

export const updateCategory = async (id, category) => {
  try {
    const response = await axios.put(`/api/categories/${id}`, category, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to update category: ${error.message}`);
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`/api/categories/${id}`);
    return handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to delete category: ${error.message}`);
  }
};

// Subcategory API calls
export const createSubcategory = async (categoryId, subcategories) => {
  try {
    const response = await axios.post(`/api/categories/${categoryId}/subcategories`, { subcategories }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to create subcategory: ${error.message}`);
  }
};

export const updateSubcategory = async (categoryId, subcategoryId, subcategory) => {
  try {
    const response = await axios.put(`/api/categories/${categoryId}/subcategory/${subcategoryId}`, subcategory, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to update subcategory: ${error.message}`);
  }
};

export const deleteSubcategory = async (categoryId, subcategoryId) => {
  try {
    const response = await axios.delete(`/api/categories/${categoryId}/subcategory/${subcategoryId}`);
    return handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to delete subcategory: ${error.message}`);
  }
};

export const getSubcategoriesByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`/api/categories/${categoryId}/subcategories`);
    return handleResponse(response);
  } catch (error) {
    throw new Error(`Failed to fetch subcategories by category: ${error.message}`);
  }
};