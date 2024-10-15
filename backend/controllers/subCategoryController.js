import Category from "../models/category.js";

class SubcategoryController {
  static slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  }

  // Create subcategories
  static async createSubcategories(subcategories, parentCategory, level) {
    for (const subcategoryData of subcategories) {
      try {
        const {
          name,
          description,
          subcategories: nestedSubcategories,
        } = subcategoryData;

        // Validate subcategory name
        if (!name || name.trim() === "") {
          throw new Error("Subcategory name is required.");
        }

        const slug = SubcategoryController.slugify(name.trim());

        // Check for duplicate subcategories under the same parent
        const existingSubcategory = await Category.findOne({
          name: name.trim(),
          parent: parentCategory._id,
        });

        if (existingSubcategory) {
          throw new Error(
            `Subcategory "${name}" already exists under this category.`
          );
        }

        const subcategory = new Category({
          name: name.trim(),
          description: description ? description.trim() : undefined,
          slug, // Add slug to the subcategory
          parent: parentCategory._id,
          level,
        });

        await subcategory.save();

        // Recursively create nested subcategories
        if (nestedSubcategories && Array.isArray(nestedSubcategories)) {
          await SubcategoryController.createSubcategories(
            nestedSubcategories,
            subcategory,
            level + 1
          );
        }

        // Add the created subcategory to the parent's subcategories array
        parentCategory.subcategories.push(subcategory._id);
      } catch (error) {
        console.error(
          `Error creating subcategory: ${subcategoryData.name}`,
          error
        );
        throw new Error(
          `Failed to create subcategory: ${subcategoryData.name}`
        );
      }
    }

    // Save the parent category after adding all subcategories
    await parentCategory.save();
  }

  // Update a subcategory
  static async updateSubcategory(req, res) {
    try {
      const { name, description } = req.body;
      const subcategoryId = req.params.id;

      const subcategory = await Category.findById(subcategoryId);
      if (!subcategory) {
        return res
          .status(404)
          .json({ success: false, message: "Subcategory not found." });
      }

      // Validate if the new name already exists under the same parent
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
        subcategory.slug = SubcategoryController.slugify(name.trim()); // Update slug when name changes
      }

      if (description !== undefined) {
        subcategory.description = description ? description.trim() : undefined;
      }

      await subcategory.save();
      res.status(200).json({
        success: true,
        message: "Subcategory updated successfully.",
        subcategory,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update subcategory.",
        error: error.message,
      });
    }
  }

  // Delete a subcategory
  static async deleteSubcategory(req, res) {
    try {
      const subcategoryId = req.params.id;

      const subcategory = await Category.findById(subcategoryId);
      if (!subcategory) {
        return res.status(404).json({
          success: false,
          message: "Subcategory not found.",
        });
      }

      await Category.deleteOne({ _id: subcategoryId });
      res.status(200).json({
        success: true,
        message: "Subcategory deleted successfully.",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete subcategory.",
        error: error.message,
      });
    }
  }

  // Get all subcategories for a specific category
  static async getSubcategories(req, res) {
    try {
      const categoryId = req.params.id;
      const category = await Category.findById(categoryId).populate(
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
  }
}

export default SubcategoryController;
