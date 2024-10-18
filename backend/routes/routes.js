import express from "express";
import multer from "multer";

import {
  getProducts,
  getOneProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/prodController.js";

import{
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
}from "../controllers/categoryController.js"

import{
  createSubcategories,
  updateSubcategory,
  deleteSubcategory,
  getsubCategorybyCategory,
  updateSubcategory,

} from '../controllers/subCategoryController.js'

import{
  createSupplier,
  getSupplierByID,
  updateSupplier,
  deleteSupplier,
  getSuppliers
}from "../controllers/supplierController.js";

const router = express.Router();

//configure multer
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Onlt valid file formats are allowed!"), false);
    }
  },
});

//Multer Error Handler

const HandleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 5MB",
      });
    }
  }
  next(error);
};


//Standardized approach of route for multer

router.route('/products')
      .get(getProducts)
      .post(upload.single('image'),HandleMulterError,addProduct)
router.route('/products/:id')
      .get(getOneProduct)
      .put(upload.single('image'),HandleMulterError,updateProduct)
      .delete(deleteProduct)


//Additional routes 
router.get('/category/:categorybyID,',getProducts)
router.get('/search',getProducts)


//Categories Routes
router.route('/categories')
      .get(getAllCategories)
      .post(createCategory)
  
//Categories Route for Fetching specific Category
router.route('/categories/:id')
      .get(getCategoryById)
      .put(updateCategory)
      .delete(deleteCategory)

//SubCategory Routes
router.route('/subcategory/:id')
      .put(updateSubcategory)
      .delete(deleteSubcategory)

router.route('/category/:id/subcategories')
      .post(createSubcategories)
      .get(getsubCategorybyCategory)
router.route('/supplier')
    
//Supplier Routes
router.route('/suppliers')
    .get(getSuppliers)
    .post(createSupplier)
router.route('/:id')
    .get(getSupplierByID)
    .put(updateSupplier)
    .delete(deleteSupplier)

