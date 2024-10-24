import express from "express";

import{

  updateSubcategory,
  deleteSubcategory,
  getSubcategoriesByCategory,
  createSubcategoriesForCategory,

} from '../controllers/subcategory.js'

const router = express.Router()

router.route('/:categoryId/subcategory/:subcategoryId')
      .put(updateSubcategory)
      .delete(deleteSubcategory)
router.route('/:categoryId/subcategories')
      .post(createSubcategoriesForCategory)
      .get( getSubcategoriesByCategory)

export default router;