
import express from 'express';

import{
    createSupplier,
    getSupplierByID,
    updateSupplier,
    deleteSupplier,
    getSuppliers
  }from "../controllers/supplierController.js";

const router = express.Router();


//Supplier Routes
router.route('/suppliers')
    .get(getSuppliers)
    .post(createSupplier)
router.route('/suppliers/:id')
    .get(getSupplierByID)
    .put(updateSupplier)
    .delete(deleteSupplier)




export default router;