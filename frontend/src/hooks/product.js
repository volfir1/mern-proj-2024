import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as productApi from "../api/productApi";
import * as categoryApi from "../api/categoryApi";
import { Formik, Form, Field, ErrorMessage } from "formik";

// Initial form state and validation function
const initialFormState = {
  name: "",
  price: "",
  description: "",
  selectedCategories: [],
  selectedSubcategories: [],
  inStock: true,
  stockQuantity: "",
};

const validateForm = (formData, imageFile) => {
  const errors = {};
  if (!formData.name.trim()) errors.name = "Product name is required";
  if (!formData.price || formData.price <= 0)
    errors.price = "Valid price is required";
  if (!formData.description.trim())
    errors.description = "Description is required";
  if (formData.selectedCategories.length === 0)
    errors.categories = "At least one category is required";
  if (!imageFile) errors.image = "Product image is required";
  if (
    formData.inStock &&
    (!formData.stockQuantity || formData.stockQuantity < 0)
  ) {
    errors.stockQuantity = "Valid stock quantity is required";
  }
  return errors;
};

// Initial state for reducer
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
  snackbar: { open: false, message: "Success", severity: "success" },
  page: 0,
  rowsPerPage: 10,
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FORM_DATA":
      return {
        ...state,
        formData:
          typeof action.payload === "function"
            ? action.payload(state.formData)
            : { ...state.formData, ...action.payload },
      };
    case "SET_IMAGE_FILE":
      return { ...state, imageFile: action.payload };
    case "SET_IMAGE_PREVIEW":
      return { ...state, imagePreview: action.payload };
    case "SET_ERRORS":
      return { ...state, errors: action.payload };
    case "SET_IS_SUBMITTING":
      return { ...state, isSubmitting: action.payload };
    case "SET_SUBCATEGORIES":
      return { ...state, subcategories: action.payload };
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_OPEN_DIALOG":
      return { ...state, openDialog: action.payload };
    case "SET_PRODUCT_TO_DELETE":
      return { ...state, productToDelete: action.payload };
    case "SET_SNACKBAR":
      return { ...state, snackbar: action.payload };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_ROWS_PER_PAGE":
      return { ...state, rowsPerPage: action.payload };
    case "RESET_FORM":
      return { ...state, formData: initialFormState };
    default:
      return state;
  }
};

// Hook: useProductManager
export const useProductManager = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(reducer, initialState);

  // Fetch utility function
  const fetchData = (key, queryFn, selectFn, errorMessage) =>
    useQuery({
      queryKey: [key],
      queryFn,
      select: selectFn,
      onError: (err) => {
        console.error(`Error fetching ${key}:`, err.message);
        showSnackbar(errorMessage, "error");
      },
    });

  // Query: Fetch products
  const {
    data: products = [],
    isLoading: loadingProducts,
    error: productsError,
  } = fetchData(
    "products",
    productApi.fetchProducts,
    (data) => data.products || [],
    "Error loading products"
  );

  // Query: Fetch categories
  const {
    data: categories = [],
    isLoading: loadingCategories,
    error: categoriesError,
  } = fetchData(
    "categories",
    categoryApi.fetchCategories,
    (data) => data?.categories || [],
    "Error loading categories"
  );

  // Mutation handlers
  const handleMutation = (mutationFn, successMessage, errorMessage) =>
    useMutation({
      mutationFn,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        showSnackbar(successMessage);
      },
      onError: (error) => showSnackbar(error.message || errorMessage, "error"),
    });

  // Mutations
  const createProductMutation = handleMutation(
    productApi.createProduct,
    "Product created successfully",
    "Error creating product"
  );
  const updateProductMutation = handleMutation(
    ({ productId, productData }) =>
      productApi.updateProduct(productId, productData),
    "Product updated successfully",
    "Error updating product"
  );
  const deleteProductMutation = handleMutation(
    ({ productId, publicId }) => productApi.deleteProduct(productId, publicId),
    "Product deleted successfully",
    "Error deleting product"
  );

  // Load subcategories by category
  const loadSubcategoriesByCategory = async (categoryId) => {
    try {
      const data = await categoryApi.getSubcategoriesByCategory(categoryId);
      return data.subcategories;
    } catch (error) {
      showSnackbar("Error loading subcategories", "error");
      return [];
    }
  };

  // Helper functions
  const showSnackbar = (message, severity = "success") => {
    dispatch({
      type: "SET_SNACKBAR",
      payload: { open: true, message, severity },
    });
  };

  const setFormData = (data) => {
    dispatch({
      type: "SET_FORM_DATA",
      payload: typeof data === "function" ? data : { ...data },
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      productApi.validateFile(file);
      dispatch({ type: "SET_IMAGE_FILE", payload: file });
      dispatch({
        type: "SET_IMAGE_PREVIEW",
        payload: URL.createObjectURL(file),
      });
      dispatch({
        type: "SET_ERRORS",
        payload: { ...state.errors, image: null },
      });
    } catch (error) {
      dispatch({
        type: "SET_ERRORS",
        payload: { ...state.errors, image: error.message },
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (state.errors[name]) {
      dispatch({
        type: "SET_ERRORS",
        payload: { ...state.errors, [name]: null },
      });
    }
  };

  const handleCategoryToggle = async (categoryId) => {
    const isSelected = state.formData.selectedCategories.includes(categoryId);
    const newSelectedCategories = isSelected
      ? state.formData.selectedCategories.filter((id) => id !== categoryId)
      : [...state.formData.selectedCategories, categoryId];

    const newSelectedSubcategories = isSelected
      ? state.formData.selectedSubcategories.filter(
          (subId) =>
            !state.subcategories.find(
              (sub) => sub.categoryId === categoryId && sub._id === subId
            )
        )
      : state.formData.selectedSubcategories;

    dispatch({
      type: "SET_FORM_DATA",
      payload: {
        selectedCategories: newSelectedCategories,
        selectedSubcategories: newSelectedSubcategories,
      },
    });

    if (!isSelected) {
      try {
        const newSubcategories = await loadSubcategoriesByCategory(categoryId);
        dispatch({
          type: "SET_SUBCATEGORIES",
          payload: [
            ...state.subcategories.filter(
              (sub) => sub.categoryId !== categoryId
            ),
            ...newSubcategories,
          ],
        });
      } catch (error) {
        console.error("Failed to load subcategories:", error);
      }
    }
  };

  const handleSubcategoryToggle = (subcategoryId) => {
    const newSelectedSubcategories =
      state.formData.selectedSubcategories.includes(subcategoryId)
        ? state.formData.selectedSubcategories.filter(
            (id) => id !== subcategoryId
          )
        : [...state.formData.selectedSubcategories, subcategoryId];

    dispatch({
      type: "SET_FORM_DATA",
      payload: { selectedSubcategories: newSelectedSubcategories },
    });
  };

  // Submit form for creating a product
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(state.formData, state.imageFile);
    if (Object.keys(validationErrors).length > 0) {
      dispatch({ type: "SET_ERRORS", payload: validationErrors });
      showSnackbar("Please fix the errors before submitting.", "error");
      return;
    }

    const productData = new FormData();
    Object.entries(state.formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => productData.append(`${key}[]`, item));
      } else if (value !== "") {
        productData.append(key, value);
      }
    });

    if (state.formData.selectedCategories.length > 0) {
      productData.append("category", state.formData.selectedCategories[0]);
    }

    if (state.formData.selectedSubcategories.length > 0) {
      productData.append(
        "subcategory",
        state.formData.selectedSubcategories[0]
      );
    }

    if (state.imageFile) {
      productData.append("image", state.imageFile);
    }

    try {
      const existingProduct = products.find(
        (product) =>
          product.name.toLowerCase() === state.formData.name.toLowerCase()
      );
      if (existingProduct) {
        showSnackbar("Product already exists.", "error");
        return;
      }

      await createProductMutation.mutateAsync(productData);
      showSnackbar("Product created successfully!", "success");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
      showSnackbar("Failed to create product.", "error");
    }
  };

  // Pagination
  const handleChangePage = (newPage) =>
    dispatch({ type: "SET_PAGE", payload: newPage });
  const handleChangeRowsPerPage = (event) => {
    dispatch({
      type: "SET_ROWS_PER_PAGE",
      payload: parseInt(event.target.value, 10),
    });
    dispatch({ type: "SET_PAGE", payload: 0 });
  };

  // Navigation
  const navigateToCreateProduct = () => navigate("/admin/create-product");

  
  const navigateToUpdateProduct = (productId) =>
    navigate(`/admin/products/${productId}`);
  const loadProductById = (productId) =>
    useQuery({
      queryKey: ["product", productId],
      queryFn: () => productApi.getProductById(productId),
      enabled: !!productId,
      onSuccess: (product) => {
        if (product) {
          setFormData({
            name: product.name || "",
            price: product.price || "",
            description: product.description || "",
            selectedCategories:
              product.categories?.map((cat) =>
                typeof cat === "object" ? cat._id : cat
              ) || [],
            selectedSubcategories:
              product.subcategories?.map((sub) =>
                typeof sub === "object" ? sub._id : sub
              ) || [],
            inStock: product.inStock ?? true,
            stockQuantity: product.stockQuantity || "",
          });
          if (product.imageUrl) {
            dispatch({ type: "SET_IMAGE_PREVIEW", payload: product.imageUrl });
          }
          if (product.categories) {
            product.categories.forEach(async (category) => {
              const categoryId =
                typeof category === "object" ? category._id : category;
              try {
                const subcategories = await loadSubcategoriesByCategory(
                  categoryId
                );
                dispatch({ type: "SET_SUBCATEGORIES", payload: subcategories });
              } catch (error) {
                console.error("Error loading subcategories:", error);
              }
            });
          }
        }
      },
      onError: (error) => {
        console.error("Error fetching product details:", error);
        showSnackbar("Error loading product details", "error");
      },
    });

  // Delete product
  const handleDeleteProduct = (product) => {
    dispatch({ type: "SET_PRODUCT_TO_DELETE", payload: product });
    dispatch({ type: "SET_OPEN_DIALOG", payload: true });
  };

  const confirmDeleteProduct = async () => {
    if (!state.productToDelete) return;
    try {
      await deleteProductMutation.mutateAsync({
        productId: state.productToDelete._id,
        publicId: state.productToDelete.publicId,
      });
      dispatch({ type: "SET_OPEN_DIALOG", payload: false });
      dispatch({ type: "SET_PRODUCT_TO_DELETE", payload: null });
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

 
  const getCategoryName = (categoryId, categoriesList) => {
    if (!categoryId || !categoriesList) return "Unknown";
    const category = categoriesList.find(cat => 
      cat._id?.toString() === categoryId?.toString() || 
      cat.id === categoryId
    );
    return category?.name || "Unknown";
  };
  
  // Return hook functions and state
  return {
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

    handleInputChange,
    handleImageChange,
    handleCategoryToggle,
    handleSubcategoryToggle,
    handleSubmit,
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
    showSnackbar,
    setFormData,
    loadProducts: () =>
      queryClient.invalidateQueries({ queryKey: ["products"] }),
    loadCategories: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
    handleChangePage,
    handleChangeRowsPerPage,
    navigateToCreateProduct,
    navigateToUpdateProduct,
    navigate,
    handleDeleteProduct,
    confirmDeleteProduct,
    loadProductById,
    getCategoryName,
    handleCloseSnackbar: () =>
      dispatch({
        type: "SET_SNACKBAR",
        payload: { ...state.snackbar, open: false },
      }),
  };
};

export default useProductManager;
