import Category from "../models/category.js";
import APIFeatures from "../utils/api-features.js";

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, parent } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Name is required and cannot be empty.",
      });
    }

    const trimmedName = name.trim();
    const existingCategory = await Category.findOne({ name: trimmedName });
    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: `Category with name "${trimmedName}" already exists.`,
      });
    }

    const slug = slugify(trimmedName);
    let level = 0;
    let path = [];

    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return res.status(400).json({
          success: false,
          message: "Parent category not found.",
        });
      }
      level = parentCategory.level + 1;
      path = [...parentCategory.path, parentCategory._id];
    }

    const newCategory = new Category({
      name: trimmedName,
      description: description ? description.trim() : undefined,
      slug,
      parent: parent || null,
      level,
      path,
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
};

export const getAllCategories = async (req, res) => {
  try {
    const resPerPage = parseInt(req.query.limit) || 10;
    const apiFeatures = new APIFeatures(Category.find({ parent: null }), req.query)
      .search()
      .filter()
      .pagination(resPerPage)
      .validate();

    const categories = await apiFeatures.query
      .sort({ level: 1, name: 1 })
      .populate({ path: "subcategories" });

    const totalCategories = await Category.countDocuments({ parent: null });

    res.status(200).json({
      success: true,
      count: categories.length,
      total: totalCategories,
      categories,
    });
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

export const getCategoryById = async (req, res) => {
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
};

export const updateCategory = async (req, res) => {
  try {
    const { name, description, parent } = req.body;
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    if (name && name.trim() !== "") {
      category.name = name.trim();
      category.slug = slugify(name.trim());
    }

    if (description !== undefined) {
      category.description = description ? description.trim() : undefined;
    }

    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return res.status(400).json({
          success: false,
          message: "Parent category not found.",
        });
      }
      category.parent = parent;
      category.level = parentCategory.level + 1;
      category.path = [...parentCategory.path, parentCategory._id];
    } else {
      category.parent = null;
      category.level = 0;
      category.path = [];
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
};

export const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    }

    const subcategories = await Category.find({ parent: categoryId });

    await Promise.all(
      subcategories.map((subcategory) =>
        Category.deleteOne({ _id: subcategory._id })
      )
    );

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
};