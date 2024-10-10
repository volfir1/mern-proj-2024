import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ProductsDemo from "./admin/product/Products";
import Suppliers from "./admin/supplier/Suppliers";
import CreateProduct from "./admin/product/CreateProduct";
import UpdateProduct from "./admin/product/UpdateProduct";
import { ThemeProvider } from "./components/theme/ThemeContext";

const App = () => {
  const location = useLocation(); // Get the current location

  return (
    <ThemeProvider>
      <div className="flex">
        {/* Sidebar */}

        {/* Pass SidebarData to Sidebar component */}
        <div className="content flex-grow">
          {/* Render the ProductsDemo or Suppliers component based on the path */}
          <Routes>
            <Route path="/admin/products" element={<ProductsDemo />} />
            <Route path="/admin/suppliers" element={<Suppliers />} />
            <Route path="/admin/create-product" element={<CreateProduct />} />
            <Route
              path="/admin/products/update/:id"
              element={<UpdateProduct />}
            />
            {/* Add more routes here if needed */}
          </Routes>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
