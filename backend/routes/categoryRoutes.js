import express from "express";


import{
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
  }from "../controllers/categoryController.js"
  
const router = express.Router();
  //Categories Routes
router.route('/')
.get(getAllCategories)
.post(createCategory)

//Categories Route for Fetching specific Category
router.route('/:id')
.get(getCategoryById)
.put(updateCategory)
.delete(deleteCategory)

export default router;