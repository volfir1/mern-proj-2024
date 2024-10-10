const express = require("express");
const multer = require("multer");
const {
  getProducts,
  getOneProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/prodController");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload an image."), false);
    }
  },
});

router.get("/prod-list", getProducts);
router.get("/prod-change/:id", getOneProduct);
router.post("/products", upload.single("image"), addProduct);
router.put("/prod-change/:id", upload.single("image"), updateProduct);
router.delete("/prod-delete/:id", deleteProduct);

module.exports = router;
