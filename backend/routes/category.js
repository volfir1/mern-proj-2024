import express from "express";
import { protect, authorize } from "../middleware/auth.js";

import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} from "../controllers/category.js";

const router = express.Router();

// Categories Routes
router.route('/')
    .get(protect, authorize, getAllCategories)  // Protect and authorize access to get all categories
    .post(protect, authorize, createCategory);   // Protect and authorize access to create a new category

// Categories Route for Fetching, Updating, and Deleting a specific Category
router.route('/:id')
    .get(protect, getCategoryById)               // Protect access to get a specific category
    .put(protect, authorize, updateCategory)      // Protect and authorize access to update a specific category
    .delete(protect, authorize, deleteCategory);  // Protect and authorize access to delete a specific category

export default router;
