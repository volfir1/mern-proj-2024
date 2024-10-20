import { useState } from "react";
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

const useCategoryManager = () => {
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

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const { data: categories = [], error: fetchError, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await fetchCategories();
        return response.categories;
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.message,
          severity: 'error'
        });
        throw error;
      }
    }
  });

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      handleClose();
      setSnackbar({
        open: true,
        message: 'Category created successfully',
        severity: 'success'
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      handleClose();
      setSnackbar({
        open: true,
        message: 'Category updated successfully',
        severity: 'success'
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      handleClose();
      setSnackbar({
        open: true,
        message: 'Category deleted successfully',
        severity: 'success'
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    }
  });

  const createSubcategoryMutation = useMutation({
    mutationFn: ({ categoryId, subcategories }) => createSubcategory(categoryId, subcategories),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      handleClose();
      setSnackbar({
        open: true,
        message: 'Subcategory created successfully',
        severity: 'success'
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    }
  });

  const updateSubcategoryMutation = useMutation({
    mutationFn: ({ categoryId, subcategoryId, data }) => 
      updateSubcategory(categoryId, subcategoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      handleClose();
      setSnackbar({
        open: true,
        message: 'Subcategory updated successfully',
        severity: 'success'
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    }
  });

  const deleteSubcategoryMutation = useMutation({
    mutationFn: ({ categoryId, subcategoryId }) => 
      deleteSubcategory(categoryId, subcategoryId),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      handleClose();
      setSnackbar({
        open: true,
        message: 'Subcategory deleted successfully',
        severity: 'success'
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error'
      });
    }
  });

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

  const handleSaveNewCategory = () => {
    if (!dialogState.newCategory.trim()) {
      setSnackbar({
        open: true,
        message: 'Category name cannot be empty',
        severity: 'error'
      });
      return;
    }
    createCategoryMutation.mutate({ name: dialogState.newCategory });
  };

  const handleUpdateCategory = () => {
    if (!dialogState.editName.trim()) {
      setSnackbar({
        open: true,
        message: 'Category name cannot be empty',
        severity: 'error'
      });
      return;
    }
    updateCategoryMutation.mutate({
      id: dialogState.currentCategory._id,
      data: { name: dialogState.editName }
    });
  };

  const handleSaveNewSubcategory = () => {
    if (!dialogState.newSubcategory.trim()) {
      setSnackbar({
        open: true,
        message: 'Subcategory name cannot be empty',
        severity: 'error'
      });
      return;
    }

    const categoryId = dialogState.currentCategory?._id;
    if (!categoryId) {
      setSnackbar({
        open: true,
        message: 'No category selected',
        severity: 'error'
      });
      return;
    }

    createSubcategoryMutation.mutate({
      categoryId,
      subcategories: [{ name: dialogState.newSubcategory }]
    });
  };

  const handleSaveEditSubcategory = () => {
    if (!dialogState.editName.trim()) {
      setSnackbar({
        open: true,
        message: 'Subcategory name cannot be empty',
        severity: 'error'
      });
      return;
    }

    const categoryId = dialogState.currentCategory?._id;
    const subcategoryId = dialogState.currentSubcategory?._id;

    if (!categoryId || !subcategoryId) {
      setSnackbar({
        open: true,
        message: 'No category or subcategory selected',
        severity: 'error'
      });
      return;
    }

    updateSubcategoryMutation.mutate({
      categoryId,
      subcategoryId,
      data: { name: dialogState.editName }
    });
  };

  // useCategoryManager.js
// ... (previous imports and code remain the same until handleSaveEditSubcategory)

const handleConfirmDelete = () => {
  if (dialogState.deleteType === 'category') {
    deleteCategoryMutation.mutate(dialogState.deleteId);
  } else if (dialogState.deleteType === 'subcategory') {
    const categoryId = dialogState.currentCategory?._id;
    if (!categoryId) {
      setSnackbar({
        open: true,
        message: 'Category not found for deletion',
        severity: 'error'
      });
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
  dialogState,
  loading: isLoading || 
           createCategoryMutation.isPending || 
           updateCategoryMutation.isPending || 
           deleteCategoryMutation.isPending ||
           createSubcategoryMutation.isPending ||
           updateSubcategoryMutation.isPending ||
           deleteSubcategoryMutation.isPending,
  error: fetchError,
  snackbar,
  handleSnackbarClose,
  setDialogState,
  handleClose,
  handleOpen,
  handleSaveNewCategory,
  handleUpdateCategory,
  handleSaveNewSubcategory,
  handleSaveEditSubcategory,
  handleConfirmDelete,
  createCategoryMutation,
  updateCategoryMutation,
  deleteCategoryMutation,
  createSubcategoryMutation,
  updateSubcategoryMutation,
  deleteSubcategoryMutation
};
};

export default useCategoryManager;