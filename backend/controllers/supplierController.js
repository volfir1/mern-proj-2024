import Supplier from "../models/supplier.js";
import Category from "../models/category.js";
import APIFeatures from "../utils/api-features.js";

export const createSupplier = async (req, res) => {
    try {
        const { name, email, phone, address, categoryID, description } = req.body;

        const category = await Category.findById(categoryID);
        if (!category) {
            return res.status(400).json({ message: "Invalid Category" });
        }

        const supplier = new Supplier({
            name,
            email,
            phone,
            address,
            category: categoryID,
            description       
        });
        await supplier.save();
        res.status(201).json(supplier);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getSuppliers = async (req, res) => {
    try {
        const resPerPage = 10; // You can adjust this or make it dynamic based on query params
        const apiFeatures = new APIFeatures(Supplier.find().populate('category', 'name'), req.query)
            .search()
            .filter()
            .pagination(resPerPage)
            .validate();

        const suppliers = await apiFeatures.query;

        const totalSuppliers = await Supplier.countDocuments();

        res.json({
            success: true,
            count: suppliers.length,
            total: totalSuppliers,
            suppliers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSupplierByID = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id).populate('category', 'name');
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }
        res.json(supplier);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSupplier = async (req, res) => {
    try {
        const { name, email, phone, address, categoryID, description, active } = req.body;

        if (categoryID) {
            const category = await Category.findById(categoryID);
            if (!category) {
                return res.status(400).json({ message: "Invalid Category" });
            }
        }

        const updatedSupplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            { name, email, phone, address, category: categoryID, description, active },
            { new: true, runValidators: true }
        );

        if (!updatedSupplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }
        res.json(updatedSupplier);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }
        res.json({ message: "Supplier deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};