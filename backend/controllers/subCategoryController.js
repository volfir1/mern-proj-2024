import Category from "../models/category.js";

// Function to slugify text
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

// Function to create subcategories for a category
export const createSubcategoriesForCategory = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { subcategories } = req.body;
    const categoryId = req.params.categoryId;

    console.log('Extracted subcategories:', subcategories);
    console.log('Category ID:', categoryId);

    const parentCategory = await Category.findById(categoryId);
    if (!parentCategory) {
      return res.status(404).json({ success: false, message: "Parent category not found." });
    }

    if (!Array.isArray(subcategories) || subcategories.length === 0) {
      return res.status(400).json({ success: false, message: "Subcategories must be a non-empty array." });
    }

    const createdSubcategories = [];

    for (const subcategoryData of subcategories) {
      const { name, description = '' } = subcategoryData;

      if (!name || typeof name !== 'string' || name.trim() === "") {
        return res.status(400).json({ success: false, message: "Each subcategory must have a valid name." });
      }

      const trimmedName = name.trim();
      const slug = slugify(trimmedName);

      const existingSubcategory = await Category.findOne({
        name: trimmedName,
        parent: parentCategory._id
      }).lean();

      if (existingSubcategory) {
        return res.status(400).json({ success: false, message: `Subcategory "${trimmedName}" already exists under this category.` });
      }

      const subcategory = new Category({
        name: trimmedName,
        description: description.trim(),
        slug,
        parent: parentCategory._id,
        level: parentCategory.level + 1,
        path: [...parentCategory.path, parentCategory._id]
      });

      await subcategory.save();
      createdSubcategories.push(subcategory);
      parentCategory.subcategories.push(subcategory._id);
    }

    await parentCategory.save();

    res.status(201).json({
      success: true,
      message: "Subcategories created successfully.",
      subcategories: createdSubcategories
    });
  } catch (error) {
    console.error("Error creating subcategories:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Function to update a subcategory
export const updateSubcategory = async (req, res) => {
  try {
    const { name } = req.body;
    const subcategoryId = req.params.subcategoryId;

    const subcategory = await Category.findById(subcategoryId);
    if (!subcategory) {
      return res.status(404).json({ success: false, message: "Subcategory not found." });
    }

    if (name && name.trim() !== "") {
      const existingSubcategory = await Category.findOne({
        name: name.trim(),
        parent: subcategory.parent,
        _id: { $ne: subcategoryId },
      });
      if (existingSubcategory) {
        return res.status(400).json({
          success: false,
          message: `Subcategory "${name}" already exists under the same parent.`,
        });
      }

      subcategory.name = name.trim();
      subcategory.slug = slugify(name.trim());
    }

    await subcategory.save();
    res.status(200).json({
      success: true,
      message: "Subcategory updated successfully.",
      subcategory,
    });
  } catch (error) {
    console.error("Failed to update subcategory:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update subcategory.",
      error: error.message,
    });
  }
};

// Function to delete a subcategory
export const deleteSubcategory = async (req, res) => {
  try {
    const subcategoryId = req.params.subcategoryId;

    const subcategory = await Category.findById(subcategoryId);
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategory not found.",
      });
    }

    await Category.deleteOne({ _id: subcategoryId });

    // Remove subcategory ID from the parent category
    await Category.updateOne(
      { _id: subcategory.parent },
      { $pull: { subcategories: subcategoryId } }
    );

    res.status(200).json({
      success: true,
      message: "Subcategory deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete subcategory:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete subcategory.",
      error: error.message,
    });
  }
};

// Function to get subcategories by category
export const getSubcategoriesByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    const category = await Category.findById(categoryId).populate({
      path: "subcategories",
      select: "name description slug level",
      options: { sort: { name: 1 } },
    });
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      category: {
        id: category._id,
        name: category.name,
      },
      subcategories: category.subcategories,
    });
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({
      success: false,
      message: "Failed fetching subcategories",
      error: error.message,
    });
  }
};
