import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useTheme } from "../../components/others/Theme"; // Ensure you have this hook

const Product = () => {
  const { isDarkMode } = useTheme(); // Get dark mode state from context
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/prod-list");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (Array.isArray(data.products)) {
        setProducts(data.products);
        setFilteredProducts(data.products);
      } else {
        setError("Invalid data format.");
      }
    } catch (error) {
      setError("Error fetching products.");
    }
  };

  const handleDeleteProduct = async () => {
    try {
      const product = products.find((p) => p._id === productToDelete);
      if (!product) {
        throw new Error("Product not found");
      }

      const imageUrlParts = product.imageUrl.split("/");
      const publicIdWithExtension = imageUrlParts.slice(-1)[0];
      const publicId = publicIdWithExtension.split(".")[0];

      const response = await fetch(`/api/prod-delete/${productToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Public-Id": publicId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      await fetchProducts();
      showSnackbar("Product deleted successfully", "success");
      setOpenDialog(false);
    } catch (error) {
      showSnackbar(error.message || "Error deleting product", "error");
    }
  };

  const confirmDeleteProduct = (productId) => {
    setProductToDelete(productId);
    setOpenDialog(true);
  };

  const handleCreateProduct = () => {
    navigate("/admin/create-product");
  };

  const handleUpdateProduct = (productId) => {
    navigate(`/admin/products/update/${productId}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => {
      setSnackbar({ open: false, message: "", severity: "success" });
    }, 5000);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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
                onClick={handleCreateProduct}
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

            <div className="bg-white shadow-md overflow-x-auto rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead
                  className={`bg-gray-50 ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`bg-white divide-y divide-gray-200 ${
                    isDarkMode ? "bg-gray-800 text-white" : ""
                  }`}
                >
                  {filteredProducts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((product) => (
                      <tr key={product._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded bg-gray-100 text-gray-800">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded ${
                              product.inStock
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                          {product.inStock && (
                            <span className="ml-2 text-sm text-gray-500">
                              (Stock: {product.stockQuantity})
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleUpdateProduct(product._id)}
                            className="text-indigo-600 hover:text-indigo-900 mr-2"
                          >
                            <PencilIcon className="h-5 w-5 inline" />
                          </button>
                          <button
                            onClick={() => confirmDeleteProduct(product._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-5 w-5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredProducts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product?
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
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Product;
