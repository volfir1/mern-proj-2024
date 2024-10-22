import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../../components/sidebar/Sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Chip,
  CircularProgress,
  Typography,
  Box,
  Collapse
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useProductManager } from '../../hooks/productManager';
import LoadingFallback from "../../components/ui/loader";
const ProductManager = () => {
  const {
    products,
    categories,
    snackbar,
    page,
    rowsPerPage,
    error,
    loadingProducts,
    loadingCategories,
    loadingSubCategories,
    subcategories,
    loadProducts,
    loadCategories,
    handleDeleteProduct,
    confirmDeleteProduct,
    handleChangePage,
    handleChangeRowsPerPage,
    handleCloseSnackbar,
    setSearchTerm,
    searchTerm,
    navigateToCreateProduct,
    navigateToUpdateProduct,
    openDialog,
    setOpenDialog,
  } = useProductManager();

  const [expandedProduct, setExpandedProduct] = useState(null);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

// Component to render individual product row
const ProductRow = ({ product, index, page, rowsPerPage, categories,subcategories, expandedProduct, toggleExpandedProduct, navigateToUpdateProduct, handleDeleteProduct, setOpenDialog }) => {
  const theme = useTheme();

  return (
    <React.Fragment key={product._id}>
      <TableRow>
        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
        <TableCell>{product._id}</TableCell>
        <TableCell>{product.name}</TableCell>
        <TableCell>{categories.find((cat) => cat._id === product.category)?.name || "Unknown"}</TableCell>
        <TableCell>{subcategories.find((cat) => cat._id === product.subcategory)?.name || "Unknown"}</TableCell>
        <TableCell>${product.price}</TableCell>
        <TableCell>
          <Chip
            label={product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
            color={product.stockQuantity > 0 ? "success" : "error"}
            size="small"
          />
          {product.stockQuantity > 0 && (
            <Typography variant="caption" display="block">{product.stockQuantity} units</Typography>
          )}
        </TableCell>
        <TableCell>
          <IconButton
            onClick={() => navigateToUpdateProduct(product._id)}
            color="primary"
            size="small"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              handleDeleteProduct(product);
              setOpenDialog(true);
            }}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
        <TableCell>
          <IconButton
            onClick={() => toggleExpandedProduct(product._id)}
            sx={{
              transform: expandedProduct === product._id ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
              }),
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <ProductDetails product={product} expanded={expandedProduct === product._id} categories={categories} />
    </React.Fragment>
  );
};

// Component to render expanded product details
const ProductDetails = ({ product, expanded, categories }) => (
  <TableRow>
    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ margin: 1 }}>
          <Typography variant="h6" gutterBottom>Product Details</Typography>
          <Box display="flex" gap={2}>
            <Box flexShrink={0}>
              <img
                src={product.imageUrl || "/api/placeholder/100/100"}
                alt={product.name}
                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '4px' }}
              />
            </Box>
            <Box>
              <Typography variant="body2" paragraph>
                <strong>Category:</strong> {categories.find((cat) => cat._id === product.category)?.name}
              </Typography>
              <Typography variant="body2">
                <strong>Price:</strong> ${product.price}
              </Typography>
              <Typography variant="body2">
                <strong>Stock:</strong> {product.stockQuantity} units
              </Typography>
            </Box>
          </Box>
        </Box>
      </Collapse>
    </TableCell>
  </TableRow>
);


  const handleConfirmDelete = async () => {
    await confirmDeleteProduct();
    loadProducts(); // Reload products after deletion
    setOpenDialog(false);
  };

  const toggleExpandedProduct = (productId) => {
    setExpandedProduct((prev) => (prev === productId ? null : productId));
  };

  const filteredProducts = Array.isArray(products)
    ? products.filter((product) =>
        product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?._id?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (loadingProducts || loadingCategories || loadingSubCategories) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <LoadingFallback />
        <Typography variant="body1" ml={2}>Loading products...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h5" color="error" gutterBottom>Error Loading Products</Typography>
        <Typography variant="body1" color="error" gutterBottom>{error.message}</Typography>
        <Button variant="contained" color="primary" onClick={loadProducts} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary', display: 'flex' }}>
      <Sidebar />
      {/* Adjust the main content to have a margin-left to account for the sidebar */}
      <Box sx={{ p: 3, ml: '95px', width: 'calc(100% - 250px)' }}>
        <Typography variant="h4" gutterBottom>Product Manager</Typography>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={navigateToCreateProduct}
          >
            Create Product
          </Button>
        </Box>

        {/* Adjust the table to fit the available width */}
        <TableContainer component={Paper} sx={{ width: '100%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '5%' }}>#</TableCell>
                <TableCell sx={{ width: '15%' }}>Product ID</TableCell>
                <TableCell sx={{ width: '20%' }}>Product Name</TableCell>
                <TableCell sx={{ width: '15%' }}>Category</TableCell>
                <TableCell sx={{ width: '15%' }}>Sub-Category</TableCell>
                <TableCell sx={{ width: '10%' }}>Price</TableCell>
                <TableCell sx={{ width: '10%' }}>Stock</TableCell>
                <TableCell sx={{ width: '10%' }}>Actions</TableCell>
                <TableCell sx={{ width: '10%' }}>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product, index) => (
                <ProductRow
                  key={product._id}
                  product={product}
                  index={index}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  categories={categories}
                  subcategories={subcategories}
                  expandedProduct={expandedProduct}
                  toggleExpandedProduct={toggleExpandedProduct}
                  navigateToUpdateProduct={navigateToUpdateProduct}
                  handleDeleteProduct={handleDeleteProduct}
                  setOpenDialog={setOpenDialog}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this product?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductManager;
