import React from "react";
import { Routes, Route } from "react-router-dom";
import ProductsDemo from "./admin/product/Products";
import Suppliers from "./admin/supplier/Suppliers";
import CreateProduct from "./admin/product/CreateProduct";
import UpdateProduct from "./admin/product/UpdateProduct";
import Settings from "./components/others/Settings";
import { ThemeProvider } from "./components/others/Theme"; // Make sure this is correct

const App = () => {
  return (
    <div className="app-wrapper">
      {" "}
      {/* This div will be the container */}
      <div className="flex">
        {/* Sidebar - You can add your Sidebar here */}

        <div className="content flex-grow">
          {/* Routes will apply dark mode across all pages */}
          <Routes>
            <Route path="/admin/products" element={<ProductsDemo />} />
            <Route path="/admin/suppliers" element={<Suppliers />} />
            <Route path="/admin/create-product" element={<CreateProduct />} />
            <Route
              path="/admin/products/update/:id"
              element={<UpdateProduct />}
            />
            <Route path="/admin/settings" element={<Settings />} />
            {/* Add more routes here */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
