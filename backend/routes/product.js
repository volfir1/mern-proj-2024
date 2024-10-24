// routes/product.js
import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  getProducts,
  getOneProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.js";

import {
  upload,
  HandleMulterError
} from "../utils/multer.js";

const router = express.Router();

// Middleware to handle async errors
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Product routes with authentication and authorization
router.route('/')
  // Public route for getting products
  .get(asyncHandler(getProducts))
  // Protected route for adding products - only admin can add
  .post(
    protect, 
    authorize('admin'),
    upload.single('image'),
    HandleMulterError,
    asyncHandler(addProduct)
  );

router.route('/:id')
  // Public route for getting single product
  .get(asyncHandler(getOneProduct))
  // Protected routes for updating and deleting - admin only
  .put(
    protect,
    authorize('admin'),
    upload.single('image'),
    HandleMulterError,
    asyncHandler(updateProduct)
  )
  .delete(
    protect,
    authorize('admin'),
    asyncHandler(deleteProduct)
  );

// Additional routes with authentication where needed
router.get(
  '/category/:categorybyID',
  asyncHandler(getProducts)
);

router.get(
  '/search',
  asyncHandler(getProducts)
);

// Add validation middleware
const validateProductInput = (req, res, next) => {
  const { name, price, description, category, subcategory } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Product name must be at least 2 characters long');
  }

  if (!price || isNaN(price) || price <= 0) {
    errors.push('Product price must be a positive number');
  }

  if (!description || description.trim().length < 10) {
    errors.push('Product description must be at least 10 characters long');
  }

  if (!category) {
    errors.push('Category is required');
  }

  if (!subcategory) {
    errors.push('Subcategory is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  next();
};

// Export router
export default router;