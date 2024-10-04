// /models/productModel.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    description: { type: String, required: true },
    inStock: { type: Boolean, default: false },
    category: { type: String, required: true },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
