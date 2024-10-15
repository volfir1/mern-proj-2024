// routes/categoryRoutes.js
import express from "express";
import CategoryController from "../controllers/categoryController.js";

const router = express.Router();

// Create a new category
router.post("/category", CategoryController.createCategory);

// Get all categories
router.get("/category-list", CategoryController.getAllCategories);

// Get a single category by ID
router.get("/category/:id", CategoryController.getCategoryById);

// Update a category
router.put("/category/:id", CategoryController.updateCategory);

// Delete a category
router.delete("/category-delete/:id", CategoryController.deleteCategory);

export default router;
