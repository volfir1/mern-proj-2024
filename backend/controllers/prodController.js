const Product = require("../models/product");
const APIFeatures = require("../utils/api-features");
const {
  uploadImage,
  deleteImage,
  checkImageExists,
} = require("../utils/cloudinary"); // Remove getCloudinaryPublicId if it's not used

exports.getProducts = async (req, res) => {
  try {
    const features = new APIFeatures(Product.find(), req.query)
      .search()
      .filter()
      .pagination(20);

    const products = await features.query;

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOneProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const productData = req.body;

    if (req.file) {
      const result = await uploadImage(req.file.buffer, {
        folder: "products",
      });
      productData.imageUrl = result.secure_url;
      productData.imagePublicId = result.public_id;
    }

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "An error occurred while adding the product",
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    let updatedData = req.body;
    const existingProduct = await Product.findById(req.params.id);

    if (!existingProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (req.file) {
      // Delete old image if it exists
      if (existingProduct.imagePublicId) {
        await deleteImage(existingProduct.imagePublicId);
      }

      // Upload new image
      const result = await uploadImage(req.file.buffer, {
        folder: "products",
      });
      updatedData.imageUrl = result.secure_url;
      updatedData.imagePublicId = result.public_id;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "An error occurred while updating the product",
    });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    // Check if the product exists
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Check if the product has an image before proceeding with Cloudinary logic
    if (product.imagePublicId) {
      const publicId = product.imagePublicId;
      console.log(`Checking if image with publicId: ${publicId} exists`);

      try {
        // Check if the image exists on Cloudinary
        await checkImageExists(publicId); // Only check existence

        // If image exists, proceed to delete it
        const result = await deleteImage(publicId);

        if (result.result === "ok") {
          console.log("Image deleted successfully from Cloudinary:", publicId);
        } else {
          console.error(
            "Failed to delete product image from Cloudinary:",
            result
          );
          return res.status(500).json({
            success: false,
            message:
              "Failed to delete product image from Cloudinary: " +
              JSON.stringify(result),
          });
        }
      } catch (error) {
        // Log the error and continue deleting the product
        console.error("Image not found on Cloudinary:", error.message);
      }
    } else {
      console.log(
        "No imagePublicId found for this product, skipping Cloudinary deletion."
      );
    }

    // Proceed to delete the product
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found after deletion attempt",
      });
    }

    // Log success message for product deletion
    console.log("Product deleted successfully:", deletedProduct._id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error while deleting product:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while deleting the product",
    });
  }
};
