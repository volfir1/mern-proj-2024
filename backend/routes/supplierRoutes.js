
import express from 'express';
import{
    createSupplier,
    getSupplierByID,
    updateSupplier,
    deleteSupplier,
    getSuppliers
}from "../controllers/supplierController.js";

const router = express.Router();


router.route('/')
    .get(getSuppliers)
    .post(createSupplier)
router.route('/:id')
    .get(getSupplierByID)
    .put(updateSupplier)
    .delete(deleteSupplier)

export default router;