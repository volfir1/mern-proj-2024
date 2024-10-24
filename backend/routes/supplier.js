
import express from 'express';

import{
    createSupplier,
    getSupplierByID,
    updateSupplier,
    deleteSupplier,
    getSuppliers
  }from "../controllers/supplier.js";

const router = express.Router();


//Supplier Routes
router.route('/')
    .get(getSuppliers)
    .post(createSupplier)
router.route('/:id')
    .get(getSupplierByID)
    .put(updateSupplier)
    .delete(deleteSupplier)




export default router;