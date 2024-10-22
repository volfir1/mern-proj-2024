import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as productApi from "../api/productApi";
import * as categoryApi from "../api/categoryApi";

// Form management utilities
const initialFormState = {
  name: '',
  price: '',
  description: '',
  selectedCategories: [],
  selectedSubcategories: [],
  inStock: true,
  stockQuantity: '',
};

const validateForm = (formData, imageFile) => {
  const errors = {};

  if (!formData.name.trim()) errors.name = 'Product name is required';
  if (!formData.price || formData.price <= 0) errors.price = 'Valid price is required';
  if (!formData.description.trim()) errors.description = 'Description is required';
  if (formData.selectedCategories.length === 0) errors.categories = 'At least one category is required';
  if (!imageFile) errors.image = 'Product image is required';
  if (formData.inStock && (!formData.stockQuantity || formData.stockQuantity < 0)) {
    errors.stockQuantity = 'Valid stock quantity is required';
  }

  return errors;
};

const initialState = {
  formData: initialFormState,
  imageFile: null,
  imagePreview: null,
  errors: {},
  isSubmitting: false,
  subcategories: [],
  searchTerm: "",
  openDialog: false,
  productToDelete: null,
  snackbar: {
    open: false,
    message: "Success",
    severity: "success",
  },
  page: 0,
  rowsPerPage: 10,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_FORM_DATA':
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case 'SET_IMAGE_FILE':
      return { ...state, imageFile: action.payload };
    case 'SET_IMAGE_PREVIEW':
      return { ...state, imagePreview: action.payload };
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    case 'SET_IS_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    case 'SET_SUBCATEGORIES':
      return { ...state, subcategories: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_OPEN_DIALOG':
      return { ...state, openDialog: action.payload };
    case 'SET_PRODUCT_TO_DELETE':
      return { ...state, productToDelete: action.payload };
    case 'SET_SNACKBAR':
      return { ...state, snackbar: action.payload };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'SET_ROWS_PER_PAGE':
      return { ...state, rowsPerPage: action.payload };
    default:
      return state;
  }
};

export const useProductManager = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(reducer, initialState);

  // Fetch data with TanStack Query v5
  const fetchData = (key, queryFn, selectFn, errorMessage) => useQuery({
    queryKey: [key],
    queryFn,
    select: selectFn,
    onError: (err) => {
      console.error(`Error fetching ${key}:`, err.message);
      showSnackbar(errorMessage, "error");
    },
  });

  const { data: products = [], isLoading: loadingProducts, error: productsError } = fetchData(
    'products',
    productApi.fetchProducts,
    (data) => data.products || [],
    "Error loading products"
  );

  const { data: categories = [], isLoading: loadingCategories, error: categoriesError } = fetchData(
    'categories',
    categoryApi.fetchCategories,
    (data) => data?.categories || [],
    "Error loading categories"
  );

  // Mutation handlers
  const handleMutation = (mutationFn, successMessage, errorMessage) => useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showSnackbar(successMessage);
    },
    onError: (error) => showSnackbar(error.message || errorMessage, "error"),
  });

  const createProductMutation = handleMutation(
    productApi.createProduct,
    "Product created successfully",
    "Error creating product"
  );

  const updateProductMutation = handleMutation(
    ({ productId, productData }) => productApi.updateProduct(productId, productData),
    "Product updated successfully",
    "Error updating product"
  );

  const deleteProductMutation = handleMutation(
    ({ productId, publicId }) => productApi.deleteProduct(productId, publicId),
    "Product deleted successfully",
    "Error deleting product"
  );

  // Load subcategories based on selected category
  const loadSubcategoriesByCategory = async (categoryId) => {
    try {
      const data = await categoryApi.getSubcategoriesByCategory(categoryId);
      return data.subcategories;
    } catch (error) {
      showSnackbar("Error loading subcategories", "error");
      return [];
    }
  };

  // Form handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: 'SET_FORM_DATA', payload: { [name]: value } });
    dispatch({ type: 'SET_ERRORS', payload: { ...state.errors, [name]: null } });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      productApi.validateFile(file);
      dispatch({ type: 'SET_IMAGE_FILE', payload: file });
      dispatch({ type: 'SET_IMAGE_PREVIEW', payload: URL.createObjectURL(file) });
      dispatch({ type: 'SET_ERRORS', payload: { ...state.errors, image: null } });
    } catch (error) {
      dispatch({ type: 'SET_ERRORS', payload: { ...state.errors, image: error.message } });
    }
  };

  const handleCategoryToggle = async (categoryId) => {
    const isSelected = state.formData.selectedCategories.includes(categoryId);
    const newSelectedCategories = isSelected
      ? state.formData.selectedCategories.filter((id) => id !== categoryId)
      : [...state.formData.selectedCategories, categoryId];

    const newSelectedSubcategories = isSelected
      ? state.formData.selectedSubcategories.filter(subId =>
          !state.subcategories.find(sub =>
            sub.categoryId === categoryId && sub._id === subId
          )
        )
      : state.formData.selectedSubcategories;

    dispatch({
      type: 'SET_FORM_DATA',
      payload: {
        selectedCategories: newSelectedCategories,
        selectedSubcategories: newSelectedSubcategories
      }
    });

    if (!isSelected) {
      try {
        const newSubcategories = await loadSubcategoriesByCategory(categoryId);
        dispatch({
          type: 'SET_SUBCATEGORIES',
          payload: [
            ...state.subcategories.filter(sub => sub.categoryId !== categoryId),
            ...newSubcategories
          ]
        });
      } catch (error) {
        console.error('Failed to load subcategories:', error);
      }
    }
  };

  const handleSubcategoryToggle = (subcategoryId) => {
    const newSelectedSubcategories = state.formData.selectedSubcategories.includes(subcategoryId)
      ? state.formData.selectedSubcategories.filter((id) => id !== subcategoryId)
      : [...state.formData.selectedSubcategories, subcategoryId];

    dispatch({
      type: 'SET_FORM_DATA',
      payload: { selectedSubcategories: newSelectedSubcategories },
    });
  };

  // Submit form for creating a product
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(state.formData, state.imageFile);
    if (Object.keys(validationErrors).length > 0) {
      dispatch({ type: 'SET_ERRORS', payload: validationErrors });
      return;
    }

    const productData = new FormData();
    Object.entries(state.formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => productData.append(`${key}[]`, item));
      } else if (value !== '') {
        productData.append(key, value);
      }
    });

    if (state.formData.selectedCategories.length > 0) {
      productData.append('category', state.formData.selectedCategories[0]);
    }

    if (state.formData.selectedSubcategories.length > 0) {
      productData.append('subcategory', state.formData.selectedSubcategories[0]);
    }

    if (state.imageFile) {
      productData.append('image', state.imageFile);
    }

    try {
      await createProductMutation.mutateAsync(productData);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  // UI state management
  const showSnackbar = (message, severity = "success") => {
    dispatch({ type: 'SET_SNACKBAR', payload: { open: true, message, severity } });
  };

  const handleCloseSnackbar = () => {
    dispatch({ type: 'SET_SNACKBAR', payload: { ...state.snackbar, open: false } });
  };

  const handleDeleteProduct = (product) => {
    dispatch({ type: 'SET_PRODUCT_TO_DELETE', payload: product });
    dispatch({ type: 'SET_OPEN_DIALOG', payload: true });
  };

  const confirmDeleteProduct = async () => {
    if (!state.productToDelete) return;

    try {
      await deleteProductMutation.mutateAsync({
        productId: state.productToDelete._id,
        publicId: state.productToDelete.publicId,
      });
      dispatch({ type: 'SET_OPEN_DIALOG', payload: false });
      dispatch({ type: 'SET_PRODUCT_TO_DELETE', payload: null });
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleChangePage = (newPage) => {
    dispatch({ type: 'SET_PAGE', payload: newPage });
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch({ type: 'SET_ROWS_PER_PAGE', payload: parseInt(event.target.value, 10) });
    dispatch({ type: 'SET_PAGE', payload: 0 });
  };

  const navigateToCreateProduct = () => {
    navigate('/admin/create-product');
  };

  const navigateToUpdateProduct = (productId) => {
    navigate(`/admin/products/update/${productId}`);
  };

  const loadProducts = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  const loadCategories = () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  };

  return {
    // State
    products,
    categories,
    formData: state.formData,
    imageFile: state.imageFile,
    imagePreview: state.imagePreview,
    errors: state.errors,
    isSubmitting: state.isSubmitting,
    subcategories: state.subcategories,
    searchTerm: state.searchTerm,
    openDialog: state.openDialog,
    productToDelete: state.productToDelete,
    snackbar: state.snackbar,
    loadingProducts,
    loadingCategories,
    page: state.page,
    rowsPerPage: state.rowsPerPage,
    error: productsError || categoriesError,

    // Form handlers
    handleInputChange,
    handleImageChange,
    handleCategoryToggle,
    handleSubcategoryToggle,
    handleSubmit,

    // Mutations
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,

    // UI state management
    showSnackbar,
    handleCloseSnackbar,
    setSearchTerm: (term) => dispatch({ type: 'SET_SEARCH_TERM', payload: term }),
    setOpenDialog: (open) => dispatch({ type: 'SET_OPEN_DIALOG', payload: open }),
    setProductToDelete: (product) => dispatch({ type: 'SET_PRODUCT_TO_DELETE', payload: product }),

    // Load functions
    loadProducts,
    loadCategories,

    // Pagination handlers
    handleChangePage,
    handleChangeRowsPerPage,

    // Navigation handlers
    navigateToCreateProduct,
    navigateToUpdateProduct,
    navigate,

    // Delete handlers
    handleDeleteProduct,
    confirmDeleteProduct,
  };
};

export default useProductManager;
