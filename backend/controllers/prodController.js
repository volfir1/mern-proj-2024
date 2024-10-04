// /controllers/productController.js
const Product = require("../models/product");
const APIFeatures = require("../utils/api-features"); // Import the APIFeatures class

// Get all products with search, filter, and pagination
const getProducts = async (req, res) => {
    try {
        const features = new APIFeatures(Product.find(), req.query)
            .search() // Apply search feature
            .filter() // Apply filter feature
            .pagination(20); // Adjust number of products per page

        const products = await features.query;

        res.status(200).json({
            success: true,
            count: products.length,
            products,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a product
const addProduct = async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a product
const updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getProducts, addProduct, updateProduct };
