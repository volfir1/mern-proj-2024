import mongoose from "mongoose"; // Import mongoose

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    description: { type: String, required: true },
    inStock: { type: Boolean, default: false },
    stockQuantity: { type: Number, default: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Category model
      ref: "Category", // The model to refer to
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the subcategory
      ref: "Category", // The model to refer to
      required: true,
    },
    imageUrl: { type: String },
    imagePublicId: { type: String }, // New field for Cloudinary public ID
  },
  { timestamps: true }
);

// Middleware to update the updatedAt field before saving
productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the Product model
const Product = mongoose.model("Product", productSchema);

export default Product; // Export the Product model
