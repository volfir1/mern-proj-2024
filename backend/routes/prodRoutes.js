// /routes/productRoutes.js
const express = require("express");
const {
    getProducts,
    addProduct,
    updateProduct,
} = require("../controllers/prodController");
const router = express.Router();

router.get("/prod-list", getProducts);
router.post("/products", addProduct);
router.put("/prod-change/:id", updateProduct);

module.exports = router;
