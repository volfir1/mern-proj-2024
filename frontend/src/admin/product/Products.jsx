import React, { useState, useMemo, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Tooltip, 
  IconButton, 
  TablePagination, 
  Button, 
  InputAdornment, 
  TableContainer, 
  Paper, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  Chip, 
  Grid,
  CircularProgress
} from '@mui/material';
import { 
  Add as AddIcon, 
  Search as SearchIcon, 
  FilterList as FilterIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { useProductManager } from '../../hooks/product';
import Sidebar from '../../components/sidebar/Sidebar';
import DeleteConfirmDialog from '../../components/dialog/DeleteConfirm';
import FeedbackSnackbar from '../../components/alert/Snackbar';
import { getCategoryName } from '@/api/categoryApi';

const CategoryName = ({ categoryId, categories }) => {
  const [name, setName] = useState('Loading...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchName = async () => {
      try {
        setIsLoading(true);
        const result = await getCategoryName(categoryId, categories);
        setName(result);
      } catch (error) {
        console.error('Error fetching category name:', error);
        setName('N/A');
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId && categories) {
      fetchName();
    } else {
      setName('N/A');
      setIsLoading(false);
    }
  }, [categoryId, categories]);

  if (isLoading) {
    return <CircularProgress size={16} />;
  }

  return <span>{name}</span>;
};

const ProductHeader = ({ searchTerm, onSearch, navigateToCreateProduct }) => (
  <Card elevation={0} sx={{ mb: 3, bgcolor: 'transparent' }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 'medium' }}>Products</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={navigateToCreateProduct}
          sx={{ borderRadius: 2 }}
        >
          Add Product
        </Button>
      </Box>
      <SearchBar searchTerm={searchTerm} onSearch={onSearch} />
    </CardContent>
  </Card>
);

const SearchBar = ({ searchTerm, onSearch }) => (
  <Box display="flex" gap={2} alignItems="center">
    <TextField
      fullWidth
      placeholder="Search products..."
      variant="outlined"
      size="small"
      value={searchTerm}
      onChange={(e) => onSearch(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        )
      }}
      sx={{ maxWidth: 400 }}
    />
    <Tooltip title="Filter">
      <IconButton><FilterIcon /></IconButton>
    </Tooltip>
  </Box>
);

const StockStatusChip = ({ stockQuantity }) => {
  let color = 'success';
  let label = 'In Stock';
  
  if (stockQuantity <= 0) {
    color = 'error';
    label = 'Out of Stock';
  } else if (stockQuantity < 10) {
    color = 'warning';
    label = 'Low Stock';
  }
  
  return <Chip label={label} color={color} size="small" />;
};

const ProductActions = ({ onEdit, onDelete }) => (
  <Box>
    <Tooltip title="Edit">
      <IconButton size="small" onClick={onEdit} sx={{ mr: 1 }}>
        <EditIcon fontSize="small" />
      </IconButton>
    </Tooltip>
    <Tooltip title="Delete">
      <IconButton size="small" onClick={onDelete}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  </Box>
);

const ProductExpandIcon = ({ isExpanded, onClick }) => (
  <IconButton onClick={onClick}>
    <ExpandMoreIcon
      sx={{
        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
      }}
    />
  </IconButton>
);

const ProductDetails = ({ product, categories, subcategories }) => (
  <TableRow>
    <TableCell colSpan={8}>
      <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
          Product Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Description:</strong> {product.description || 'No description available'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>SKU:</strong> {product.sku || 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Category:</strong> {' '}
              <CategoryName categoryId={product.category} categories={categories} />
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Stock Quantity:</strong> {product.stockQuantity}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Price:</strong> ${product.price.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Subcategory:</strong> {' '}
              <CategoryName categoryId={product.subcategory} categories={subcategories} />
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </TableCell>
  </TableRow>
);

const ProductTableHeader = () => (
  <TableHead>
    <TableRow>
      <TableCell>#</TableCell>
      <TableCell>Product Name</TableCell>
      <TableCell>Category</TableCell>
      <TableCell>Sub Category</TableCell>
      <TableCell>Price</TableCell>
      <TableCell>Stock Status</TableCell>
      <TableCell align="right">Actions</TableCell>
      <TableCell />
    </TableRow>
  </TableHead>
);

const ProductRow = React.memo(({ 
  product, 
  index, 
  categories, 
  subcategories,
  onEdit,
  onDelete,
  isExpanded,
  onToggleExpand 
}) => (
  <React.Fragment>
    <TableRow hover>
      <TableCell>{index}</TableCell>
      <TableCell>{product.name}</TableCell>
      <TableCell>
        <CategoryName categoryId={product.category} categories={categories} />
      </TableCell>
      <TableCell>
        <CategoryName categoryId={product.subcategory} categories={subcategories} />
      </TableCell>
      <TableCell>${product.price.toLocaleString()}</TableCell>
      <TableCell>
        <StockStatusChip stockQuantity={product.stockQuantity} />
      </TableCell>
      <TableCell align="right">
        <ProductActions onEdit={() => onEdit(product._id)} onDelete={() => onDelete(product)} />
      </TableCell>
      <TableCell>
        <ProductExpandIcon isExpanded={isExpanded} onClick={onToggleExpand} />
      </TableCell>
    </TableRow>
    {isExpanded && (
      <ProductDetails 
        product={product}
        categories={categories}
        subcategories={subcategories}
      />
    )}
  </React.Fragment>
));

const ProductTable = React.memo(({ 
  products, 
  page, 
  rowsPerPage, 
  categories, 
  subcategories,
  onEdit,
  onDelete,
  expandedProduct,
  setExpandedProduct,
  isLoading 
}) => {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <ProductTableHeader />
        <TableBody>
          {products
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((product, index) => (
              <ProductRow 
                key={product._id}
                product={product}
                index={page * rowsPerPage + index + 1}
                categories={categories}
                subcategories={subcategories}
                onEdit={onEdit}
                onDelete={onDelete}
                isExpanded={expandedProduct === product._id}
                onToggleExpand={() => setExpandedProduct(
                  expandedProduct === product._id ? null : product._id
                )}
              />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

const ErrorView = ({ error, onRetry }) => (
  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
    <Typography variant="h6" color="error" gutterBottom>
      {error.message || 'An error occurred while loading products'}
    </Typography>
    <Button variant="contained" onClick={onRetry} sx={{ mt: 2 }}>
      Retry
    </Button>
  </Box>
);

const LoadingView = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
    <CircularProgress />
  </Box>
);

const ProductManager = () => {
  const {
    products,
    categories,
    subcategories,
    searchTerm,
    page,
    rowsPerPage,
    error,
    snackbar,
    isLoading,
    handleInputChange,
    handleDeleteProduct,
    handleChangePage,
    handleChangeRowsPerPage,
    navigateToCreateProduct,
    navigateToUpdateProduct,
    handleCloseSnackbar,
    loadProducts,
  } = useProductManager();

  const [expandedProduct, setExpandedProduct] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    const searchLower = searchTerm?.toLowerCase() || '';
    return products.filter((product) => (
      product.name?.toLowerCase().includes(searchLower) ||
      product._id?.toString().includes(searchLower)
    ));
  }, [products, searchTerm]);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      await handleDeleteProduct(productToDelete);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  if (error) {
    return <ErrorView error={error} onRetry={loadProducts} />;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: 3, 
        ml: { xs: '20px', sm: '95px' },
        width: { sm: `calc(100% - 95px)` }
      }}>
        <ProductHeader 
          searchTerm={searchTerm}
          onSearch={handleInputChange}
          navigateToCreateProduct={navigateToCreateProduct}
        />

        {isLoading ? (
          <LoadingView />
        ) : (
          <>
            <ProductTable 
              products={filteredProducts}
              page={page}
              rowsPerPage={rowsPerPage}
              categories={categories}
              subcategories={subcategories}
              onEdit={navigateToUpdateProduct}
              onDelete={handleDeleteClick}
              expandedProduct={expandedProduct}
              setExpandedProduct={setExpandedProduct}
              isLoading={isLoading}
            />

            <TablePagination
              component="div"
              count={filteredProducts.length}
              page={page}
              onPageChange={(_, newPage) => handleChangePage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </>
        )}

        <DeleteConfirmDialog 
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Product"
          content={`Are you sure you want to delete ${productToDelete?.name}?`}
        />

        <FeedbackSnackbar snackbar={snackbar} onClose={handleCloseSnackbar} />
      </Box>
    </Box>
  );
};

export default ProductManager;