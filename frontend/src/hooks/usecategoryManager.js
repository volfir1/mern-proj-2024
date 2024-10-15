import { useState, useEffect } from "react";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from "../api/categoryApi"; // Adjust the import path as necessary

const useCategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [editName, setEditName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [open, setOpen] = useState(false);
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [openAddSubcategory, setOpenAddSubcategory] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentSubcategory, setCurrentSubcategory] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteType, setDeleteType] = useState("");
  const [subCategory, setSubCategories] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveNewCategory = async () => {
    if (!newCategory.trim()) {
      setError("Category name cannot be empty");
      return;
    }
    try {
      await createCategory({ name: newCategory });
      await loadCategories();
      setNewCategory("");
      setOpenAddCategory(false);
      setSuccess("Category created successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editName.trim()) {
      setError("Category name cannot be empty");
      return;
    }
    try {
      await updateCategory(currentCategory._id, { name: editName });
      await loadCategories();
      setOpen(false);
      setSuccess("Category updated successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCategory = (categoryId) => {
    setOpenDeleteDialog(true);
    setDeleteId(categoryId);
    setDeleteType("category");
  };

  const handleAddCategory = () => {
    setNewCategory("");
    setOpenAddCategory(true);
  };

  const handleAddSubcategory = (categoryId) => {
    setCurrentCategory(categoryId);
    setNewSubcategory("");
    setOpenAddSubcategory(true);
  };

  const handleSaveNewSubcategory = async () => {
    if (!newSubcategory.trim()) {
      setError("Subcategory name cannot be empty");
      return;
    }
    try {
      await createSubcategory(currentCategory, { name: newSubcategory });
      await loadCategories();
      setNewSubcategory("");
      setOpenAddSubcategory(false);
      setSuccess("Subcategory created successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateSubcategory = async () => {
    if (!editName.trim()) {
      setError("Subcategory name cannot be empty");
      return;
    }
    try {
      await updateSubcategory(currentSubcategory._id, { name: editName });
      await loadCategories();
      setOpen(false);
      setSuccess("Subcategory updated successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteSubcategory = (subcategoryId) => {
    setOpenDeleteDialog(true);
    setDeleteId(subcategoryId);
    setDeleteType("subcategory");
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteType === "category") {
        await deleteCategory(deleteId);
      } else {
        await deleteSubcategory(deleteId);
      }
      await loadCategories();
      setOpenDeleteDialog(false);
      setSuccess(`${deleteType} deleted successfully`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpen = (category = null, subcategory = null) => {
    if (category) {
      setCurrentCategory(category);
      setEditName(category.name);
    } else if (subcategory) {
      setCurrentSubcategory(subcategory);
      setEditName(subcategory.name);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenAddCategory(false);
    setOpenAddSubcategory(false);
    setOpenDeleteDialog(false);
    setEditName("");
    setNewCategory("");
    setNewSubcategory("");
    setCurrentCategory(null);
    setCurrentSubcategory(null);
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  const getSubCategoryName = (categories, subCategoryId) => {
    if (!Array.isArray(categories)) {
      console.warn("Categories is not an array:", categories);
      return "Unknown";
    }

    const subCategory = categories
      .flatMap((cat) => cat.subcategories || [])
      .find((sub) => sub && sub._id === subCategoryId);
    return subCategory ? subCategory.name : "Unknown";
  };

  return {
    categories,
    getSubCategoryName,
    // ... other returned values
  };

  return {
    categories,
    newCategory,
    newSubcategory,
    error,
    success,
    open,
    openAddCategory,
    openAddSubcategory,
    currentCategory,
    currentSubcategory,
    editName,
    openDeleteDialog,
    subCategory,
    setNewCategory,
    setNewSubcategory,
    setEditName,
    handleSaveNewCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleAddSubcategory,
    handleSaveNewSubcategory,
    handleUpdateSubcategory,
    handleDeleteSubcategory,
    handleConfirmDelete,
    handleOpen,
    handleClose,
    handleCloseSnackbar,
    handleAddCategory,
    loadCategories,
    getSubCategoryName,
    setSubCategories,
  };
};

export default useCategoryManager;
