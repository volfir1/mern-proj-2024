// controllers/CategoryController.js
import Category from "../models/category.js";


  export const slugify = (text)=>{
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  };

  // Create a new category
export const createCategory = async (req, res) => {
    try {
      const { name, description } = req.body;

      if (!name || name.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Name is required and cannot be empty.",
        });
      }

      const slug = CategoryController.slugify(name.trim());
      const newCategory = new Category({
        name: name.trim(),
        description: description ? description.trim() : undefined,
        slug, // Add slug to the new category
      });

      await newCategory.save();

      res.status(201).json({
        success: true,
        message: "Category created successfully",
        category: newCategory,
      });
    } catch (error) {
      console.error("Error in createCategory:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  // Get all categories
 export const getAllCategories =  async (req, res) => {
    try {
      const categories = await Category.find({ parent: null })
        .sort({ level: 1, name: 1 })
        .populate({ path: "subcategories" });
      res.status(200).json({ success: true, categories });
    } catch (error) {
      console.error("Error in getAllCategories:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch categories",
        error: error.message,
      });
    }
  }

  // Get category by ID
 export const getCategoryById =  async (req, res) =>{
    try {
      const category = await Category.findById(req.params.id).populate({
        path: "subcategories",
      });
      if (!category) {
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }
      res.status(200).json({ success: true, category });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch category",
        error: error.message,
      });
    }
  }

  // Update a category
 export const updateCategory = async (req, res) => {
    try {
      const { name, description } = req.body;
      const categoryId = req.params.id;

      const category = await Category.findById(categoryId);
      if (!category) {
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }

      if (name && name.trim() !== "") {
        category.name = name.trim();
        category.slug = CategoryController.slugify(name.trim());
      }

      if (description !== undefined) {
        category.description = description ? description.trim() : undefined;
      }

      await category.save();
      res.status(200).json({
        success: true,
        message: "Category updated successfully",
        category,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update category",
        error: error.message,
      });
    }
  }

  // Delete a category
 export const deleteCategory = async (req, res) => {
    try {
      const categoryId = req.params.id;

      const category = await Category.findById(categoryId);
      if (!category) {
        return res
          .status(404)
          .json({ success: false, message: "Category not found." });
      }

      // Find all subcategories of the category
      const subcategories = await Category.find({ parent: categoryId });

      // Delete each subcategory
      await Promise.all(
        subcategories.map((subcategory) =>
          Category.deleteOne({ _id: subcategory._id })
        )
      );

      // Finally, delete the main category
      await Category.deleteOne({ _id: categoryId });

      res.status(200).json({
        success: true,
        message: "Category deleted successfully.",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete category.",
        error: error.message,
      });
    }
  }


