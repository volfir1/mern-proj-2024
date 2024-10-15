import express from "express";
import SubCategoryController from "../controllers/subCategoryController.js"; // Controller for subcategory logic
import Category from "../models/category.js"; // Import the Category model

const router = express.Router();

// Create subcategories under a category
router.post("/category/:id/subcategories", async (req, res) => {
  try {
    const { subcategories } = req.body;

    // Find the parent category by ID
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }

    // Use SubCategoryController to create subcategories
    await SubCategoryController.createSubcategories(
      subcategories,
      category,
      category.level + 1
    );

    res
      .status(201)
      .json({ success: true, message: "Subcategories created successfully" });
  } catch (error) {
    console.error("Error creating subcategories:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update a subcategory
router.put("/subcategory/:id", SubCategoryController.updateSubcategory);

// Delete a subcategory
router.delete("/subcategory/:id", SubCategoryController.deleteSubcategory);

// Get all subcategories for a specific category
router.get("/category/:id/subcategories", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "subcategories"
    );

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }

    res
      .status(200)
      .json({ success: true, subcategories: category.subcategories });
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
