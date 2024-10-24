import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  getCategoryById,
} from "../api/categoryApi";

const useCategoryManager = (initialCategoryId = null) => {
  const queryClient = useQueryClient();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [dialogState, setDialogState] = useState({
    open: false,
    openAddCategory: false,
    openAddSubcategory: false,
    openDeleteDialog: false,
    editName: "",
    newCategory: "",
    newSubcategory: "",
    currentCategory: null,
    currentSubcategory: null,
    deleteId: null,
    deleteType: "",
  });

  // Main categories query
  const { data: categories = [], isLoading, error: fetchError } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  // Single category query (if needed)
  const { data: currentCategory } = useQuery({
    queryKey: ['category', initialCategoryId],
    queryFn: () => getCategoryById(initialCategoryId),
    enabled: !!initialCategoryId,
  });

  // Helper function for mutations
  const createMutation = (mutationFn, successMessage, options = {}) => {
    return useMutation({
      mutationFn,
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['categories'] });
        handleClose();
        handleSnackbar(successMessage);
        options.onSuccess?.();
      },
      onError: (error) => {
        handleSnackbar(error.message, 'error');
        options.onError?.(error);
      }
    });
  };

  // Mutations
  const createCategoryMutation = createMutation(
    createCategory, 
    'Category created successfully'
  );

  const updateCategoryMutation = createMutation(
    ({ id, data }) => updateCategory(id, data), 
    'Category updated successfully'
  );

  const deleteCategoryMutation = createMutation(
    deleteCategory, 
    'Category deleted successfully'
  );

  const createSubcategoryMutation = createMutation(
    ({ categoryId, subcategories }) => createSubcategory(categoryId, subcategories),
    'Subcategory created successfully'
  );

  const updateSubcategoryMutation = createMutation(
    ({ categoryId, subcategoryId, data }) => updateSubcategory(categoryId, subcategoryId, data),
    'Subcategory updated successfully'
  );

  const deleteSubcategoryMutation = createMutation(
    ({ categoryId, subcategoryId }) => deleteSubcategory(categoryId, subcategoryId),
    'Subcategory deleted successfully'
  );

  // Utility functions
  const handleSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const getSubCategoryName = (categoryId, subCategoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    const subCategory = category?.subcategories?.find(sub => sub._id === subCategoryId);
    return subCategory ? subCategory.name : 'Unknown';
  };

  // Dialog handlers
  const handleClose = () => {
    setDialogState({
      open: false,
      openAddCategory: false,
      openAddSubcategory: false,
      openDeleteDialog: false,
      editName: "",
      newCategory: "",
      newSubcategory: "",
      currentCategory: null,
      currentSubcategory: null,
      deleteId: null,
      deleteType: "",
    });
  };

  const handleOpen = (category = null, subcategory = null) => {
    setDialogState(prev => ({
      ...prev,
      open: true,
      currentCategory: category,
      currentSubcategory: subcategory,
      editName: category?.name || subcategory?.name || "",
    }));
  };

  // Save handlers
  const handleSaveNewCategory = () => {
    if (!dialogState.newCategory.trim()) {
      handleSnackbar('Category name cannot be empty', 'error');
      return;
    }
    createCategoryMutation.mutate({ name: dialogState.newCategory });
  };

  const handleUpdateCategory = () => {
    if (!dialogState.editName.trim()) {
      handleSnackbar('Category name cannot be empty', 'error');
      return;
    }
    updateCategoryMutation.mutate({
      id: dialogState.currentCategory._id,
      data: { name: dialogState.editName }
    });
  };

  const handleSaveNewSubcategory = () => {
    if (!dialogState.newSubcategory.trim()) {
      handleSnackbar('Subcategory name cannot be empty', 'error');
      return;
    }

    const categoryId = dialogState.currentCategory?._id;
    if (!categoryId) {
      handleSnackbar('No category selected', 'error');
      return;
    }

    createSubcategoryMutation.mutate({
      categoryId,
      subcategories: [{ name: dialogState.newSubcategory }]
    });
  };

  const handleConfirmDelete = () => {
    if (dialogState.deleteType === 'category') {
      deleteCategoryMutation.mutate(dialogState.deleteId);
    } else if (dialogState.deleteType === 'subcategory') {
      const categoryId = dialogState.currentCategory?._id;
      if (!categoryId) {
        handleSnackbar('Category not found for deletion', 'error');
        return;
      }
      deleteSubcategoryMutation.mutate({
        categoryId,
        subcategoryId: dialogState.deleteId
      });
    }
  };

  return {
    categories,
    currentCategory,
    dialogState,
    snackbar,
    isLoading,
    error: fetchError,
    getCategoryName,
    getSubCategoryName,
    handleSnackbarClose,
    setDialogState,
    handleClose,
    handleOpen,
    handleSaveNewCategory,
    handleUpdateCategory,
    handleSaveNewSubcategory,
    handleConfirmDelete,
    mutations: {
      createCategory: createCategoryMutation,
      updateCategory: updateCategoryMutation,
      deleteCategory: deleteCategoryMutation,
      createSubcategory: createSubcategoryMutation,
      updateSubcategory: updateSubcategoryMutation,
      deleteSubcategory: deleteSubcategoryMutation,
    }
  };
};

export default useCategoryManager;