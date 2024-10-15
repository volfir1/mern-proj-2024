import React from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Sidebar from "../../components/sidebar/Sidebar";
import TablePagination from "@mui/material/TablePagination";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import { useTheme } from "../../components/others/Theme";
import { getCategoryName, useProductManager } from "../../hooks/productManager";
import useCategoryManager from "../../hooks/usecategoryManager";

const ProductManager = () => {
  const { isDarkMode } = useTheme();
  const {
    categories,
    filteredProducts,
    error,
    searchTerm,
    snackbar,
    openDialog,
    page,
    rowsPerPage,
    loadProducts,
    loadCategories,
    handleDeleteProduct,
    confirmDeleteProduct,
    handleChangePage,
    handleChangeRowsPerPage,
    handleCloseSnackbar,
    setSearchTerm,
    setOpenDialog,
    navigateToCreateProduct,
    navigateToUpdateProduct,
  } = useProductManager();
  const { subCategory, getSubCategoryName } = useCategoryManager();

  React.useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  return (
    <div
      className={`flex h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-[80px]">
        <main
          className={`flex-1 overflow-x-hidden overflow-y-auto ${
            isDarkMode ? "bg-gray-800" : "bg-gray-100"
          } px-8 py-8`}
        >
          <div className="container mx-auto">
            <h1
              className={`text-4xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              } mb-8`}
            >
              Products
            </h1>

            <Snackbar
              open={snackbar.open}
              autoHideDuration={4000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <MuiAlert
                elevation={6}
                variant="filled"
                severity={snackbar.severity}
                onClose={handleCloseSnackbar}
              >
                {snackbar.message}
              </MuiAlert>
            </Snackbar>

            <div className="mb-6 flex justify-between items-center">
              <input
                type="text"
                placeholder="Search products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-64 px-4 py-2 border ${
                  isDarkMode
                    ? "border-gray-700 bg-gray-800 text-white"
                    : "border-gray-300"
                } rounded focus:outline-none focus:ring-2 focus:ring-red-500`}
              />
              <button
                onClick={navigateToCreateProduct}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none"
              >
                <PlusIcon className="h-5 w-5 inline-block mr-2" />
                Add new product
              </button>
            </div>

            {error && (
              <div
                className={`border-l-4 p-4 mb-6 ${
                  isDarkMode
                    ? "bg-red-800 border-red-600 text-white"
                    : "bg-red-100 border-red-500 text-red-700"
                }`}
                role="alert"
              >
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}

            {filteredProducts.length === 0 && !error && (
              <div
                className={`text-center p-4 ${
                  isDarkMode ? "text-white" : "text-gray-700"
                }`}
              >
                No products found.
              </div>
            )}

            <div className="bg-white shadow-md overflow-x-auto rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead
                  className={`bg-gray-50 ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <tr>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subcategory
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((product) => (
                      <tr key={product._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {getCategoryName(categories, product.category)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {getSubCategoryName(subCategory, product.subcategory)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          ${product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {product.stockQuantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => navigateToUpdateProduct(product._id)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <PencilIcon className="h-5 w-5 inline-block" />
                          </button>
                          <button
                            onClick={() => confirmDeleteProduct(product._id)}
                            className="text-red-500 hover:text-red-700 ml-4"
                          >
                            <TrashIcon className="h-5 w-5 inline-block" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredProducts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              className="mt-4"
            />

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogContent>
                <p>Are you sure you want to delete this product?</p>
              </DialogContent>
              <DialogActions>
                <button
                  onClick={() => setOpenDialog(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </DialogActions>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductManager;
