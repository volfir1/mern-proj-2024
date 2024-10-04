import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ProductsDemo from "./admin/product/Products";
import Suppliers from "./admin/supplier/Suppliers";
import CreateProduct from "./admin/product/CreateProduct";
import UpdateProduct from "./admin/product/UpdateProduct";

const App = () => {
    const location = useLocation(); // Get the current locations

    return (
        <div className="content">
            {/* Render the ProductsDemo or Suppliers component based on the path */}
            <Routes>
                <Route path="/admin/products" element={<ProductsDemo />} />
                <Route path="/admin/suppliers" element={<Suppliers />} />
                <Route
                    path="/admin/create-product"
                    element={<CreateProduct />}
                />
                <Route
                    path="/admin/update-product"
                    element={<UpdateProduct />}
                />
                {/* Add more routes here if needed */}
            </Routes>
        </div>
    );
};

export default App;
