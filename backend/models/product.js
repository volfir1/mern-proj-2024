import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    description: { type: String, required: true },
    inStock: { type: Boolean, default: false },
    stockQuantity: { type: Number, default: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    imageUrl: { type: String },
    imagePublicId: { type: String },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true }, // Enable virtuals when converting to JSON
    toObject: { virtuals: true } // Enable virtuals when converting to object
  }
);

// Pre-save middleware
productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create a static method for fetching products with populated fields
productSchema.statics.findWithCategories = function() {
  return this.find()
    .populate("category", "name") // Populate category with name field
    .populate("subcategory", "name"); // Populate subcategory with name field
};

// Create the Product model
const Product = mongoose.model("Product", productSchema);

export default Product;