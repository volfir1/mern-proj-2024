import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"; // Updated imports
import Sidebar from "../../components/sidebar/Sidebar";
import TablePagination from "@mui/material/TablePagination"; // Material-UI pagination
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material"; // Modal for confirmation

const Product = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openDialog, setOpenDialog] = useState(false); // State to open confirmation dialog
  const [productToDelete, setProductToDelete] = useState(null); // Track product to delete

  const [page, setPage] = useState(0); // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page

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
      const response = await fetch("/api/prod-list"); // Updated route
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

      // Get the public ID from the image URL
      const imageUrlParts = product.imageUrl.split("/");
      const publicIdWithExtension = imageUrlParts.slice(-1)[0]; // Last part of URL
      const publicId = publicIdWithExtension.split(".")[0]; // Remove the extension

      const response = await fetch(`/api/prod-delete/${productToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Public-Id": publicId, // Send the public ID if your backend requires it
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      // Refetch products after deletion
      await fetchProducts();
      showSnackbar("Product deleted successfully", "success");
      setOpenDialog(false); // Close confirmation dialog
    } catch (error) {
      showSnackbar(error.message || "Error deleting product", "error");
    }
  };

  const confirmDeleteProduct = (productId) => {
    setProductToDelete(productId); // Set the product to delete
    setOpenDialog(true); // Open the confirmation dialog
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
    }, 5000); // Auto-hide after 5 seconds
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-[80px]">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 px-8 py-8">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Products</h1>

            {/* Snackbar for alerts */}
            {snackbar.open && (
              <div
                className={`fixed top-0 left-0 w-full p-4 bg-${
                  snackbar.severity === "success" ? "green" : "red"
                }-500 text-white flex justify-between items-center`}
              >
                <span>{snackbar.message}</span>
                <button
                  className="ml-4"
                  onClick={() => setSnackbar({ ...snackbar, open: false })}
                >
                  <XMarkIcon className="h-5 w-5 inline-block" />{" "}
                  {/* Close button */}
                </button>
              </div>
            )}

            <div className="mb-6 flex justify-between items-center">
              <input
                type="text"
                placeholder="Search products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
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
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
                role="alert"
              >
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}

            <div className="bg-white shadow-md overflow-x-auto rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Product Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Stock
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Slice data for pagination
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
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => confirmDeleteProduct(product._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-5 w-5" />
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
            />

            {/* Confirmation Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogContent>
                Are you sure you want to delete this product?
              </DialogContent>
              <DialogActions>
                <button
                  onClick={() => setOpenDialog(false)}
                  className="px-4 py-2 bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="px-4 py-2 bg-red-500 text-white"
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

export default Product;
