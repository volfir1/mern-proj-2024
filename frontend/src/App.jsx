import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider as CustomThemeProvider } from "./components/others/Theme";
import LoadingFallback from "./components/ui/loader";

// Lazy load components
const ProductsDemo = lazy(() => import("./admin/product/Products"));
const Suppliers = lazy(() => import("./admin/supplier/Suppliers"));
const CreateProduct = lazy(() => import("./admin/product/CreateProduct"));
const UpdateProduct = lazy(() => import("./admin/product/UpdateProduct"));
const Settings = lazy(() => import("./components/others/Settings"));
const Category = lazy(() => import("./admin/category/Category"));

const theme = createTheme();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CustomThemeProvider>
        <div className="app-wrapper">
          <div className="flex">
            {/* Sidebar - You can add your Sidebar here */}
            <div className="content flex-grow">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/admin/products" element={<ProductsDemo />} />
                  <Route path="/admin/suppliers" element={<Suppliers />} />
                  <Route
                    path="/admin/create-product"
                    element={<CreateProduct />}
                  />
                  <Route
                    path="/admin/products/update/:id"
                    element={<UpdateProduct />}
                  />
                  <Route path="/admin/settings" element={<Settings />} />
                  <Route path="/admin/categories" element={<Category />} />
                </Routes>
              </Suspense>
            </div>
          </div>
        </div>
      </CustomThemeProvider>
    </ThemeProvider>
  );
};

export default App;
