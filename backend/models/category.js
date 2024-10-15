import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      unique: true, // Ensure slug is unique
      required: true,
      trim: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    level: {
      type: Number,
      default: 0,
    },
    path: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for backward compatibility and flexibility
categorySchema.virtual("virtualSubcategories", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent",
});

// Add necessary indexes
categorySchema.index({ name: 1, parent: 1 }, { unique: true });
categorySchema.index({ parent: 1 }); // For faster querying of subcategories
categorySchema.index({ path: 1 }); // For faster ancestor/descendant queries

const Category = mongoose.model("Category", categorySchema);

export default Category;
