import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Snackbar,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate, useParams } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "#f8f9fa",
  padding: theme.spacing(3),
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  minHeight: "calc(100vh - 48px)",
  display: "flex",
  flexDirection: "column",
}));

const ImageUploader = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "250px",
  border: "2px dashed #ced4da",
  borderRadius: "4px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: "#e9ecef",
  },
}));

const ImagePreview = styled("img")({
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain",
  borderRadius: "4px",
});

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    borderRadius: "4px",
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    borderRadius: "4px",
  },
}));

const UpdateProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subcategories: [],
    inStock: true,
    stockQuantity: "",
    imageUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoryModalOpen, setSubcategoryModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product.category) {
      fetchSubcategories(product.category);
    }
  }, [product.category]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/category-list");
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await axios.get(
        `/api/category/${categoryId}/subcategories`
      );
      setSubcategories(response.data.subcategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/prod-change/${id}`);
      const data = response.data.product;

      // Ensure subcategories is always an array
      setProduct({
        ...data,
        subcategories: data.subcategories || [], // Default to empty array if undefined
      });
      setImagePreview(data.imageUrl);
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error fetching product: ${
          error.response?.data?.message || error.message
        }`,
        severity: "error",
      });
    }
  };

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubcategoryChange = (event) => {
    const { value } = event.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      subcategories: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setConfirmOpen(true);
  };

  const handleConfirmUpdate = async () => {
    setLoading(true);
    setConfirmOpen(false);

    try {
      const formData = new FormData();
      Object.keys(product).forEach((key) => {
        if (key === "price" || key === "stockQuantity") {
          formData.append(key, parseFloat(product[key]));
        } else {
          formData.append(key, product[key]);
        }
      });

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axios.put(`/api/prod-change/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSnackbar({
        open: true,
        message: "Product updated successfully",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/admin/products");
      }, 2000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error updating product: ${
          error.response?.data?.message || error.message
        }`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/products");
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenSubcategoryModal = () => {
    setSubcategoryModalOpen(true);
  };

  const handleCloseSubcategoryModal = () => {
    setSubcategoryModalOpen(false);
  };

  const handleSubcategorySelect = (subcategoryId) => {
    setProduct((prevProduct) => {
      const newSubcategories = prevProduct.subcategories.includes(subcategoryId)
        ? prevProduct.subcategories.filter((id) => id !== subcategoryId)
        : [...prevProduct.subcategories, subcategoryId];
      return { ...prevProduct, subcategories: newSubcategories };
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2, minHeight: "100vh" }}>
      <StyledPaper>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 300, textAlign: "center", mb: 3 }}
        >
          Update Product
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
          <Grid container spacing={3} sx={{ flexGrow: 1 }}>
            <Grid item xs={12} md={6}>
              <StyledTextField
                fullWidth
                required
                label="Product Name"
                name="name"
                value={product.name}
                onChange={handleChange}
              />
              <StyledFormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
              <Button
                variant="outlined"
                onClick={handleOpenSubcategoryModal}
                sx={{ mb: 2 }}
              >
                Select Subcategories
              </Button>
              <Box className="flex flex-wrap gap-2 mt-2">
                {product.subcategories.map((subcategoryId) => {
                  const subcategory = subcategories.find(
                    (sub) => sub._id === subcategoryId
                  );
                  return (
                    <Chip
                      key={subcategoryId}
                      label={subcategory?.name}
                      onDelete={() => handleSubcategorySelect(subcategoryId)}
                      color="primary"
                      sx={{ mb: 1 }}
                    />
                  );
                })}
              </Box>
              <StyledTextField
                fullWidth
                required
                multiline
                rows={4}
                label="Description"
                name="description"
                value={product.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ImageUploader onClick={handleImageClick}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
                {imagePreview ? (
                  <ImagePreview src={imagePreview} alt="Product preview" />
                ) : (
                  <Typography variant="body1" color="textSecondary">
                    Click or drag to upload image
                  </Typography>
                )}
              </ImageUploader>
              {imageFile && (
                <Typography
                  variant="caption"
                  sx={{ mt: 1, textAlign: "center" }}
                >
                  {imageFile.name}
                </Typography>
              )}
              <StyledTextField
                fullWidth
                required
                type="number"
                label="Price"
                name="price"
                value={product.price}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={product.inStock}
                    onChange={handleChange}
                    name="inStock"
                    color="primary"
                  />
                }
                label="In Stock"
                sx={{ mb: 2 }}
              />
              {product.inStock && (
                <StyledTextField
                  fullWidth
                  required
                  type="number"
                  label="Stock Quantity"
                  name="stockQuantity"
                  value={product.stockQuantity}
                  onChange={handleChange}
                />
              )}
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: "auto",
              pt: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={{ borderRadius: "4px" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                borderRadius: "4px",
                backgroundColor: "#e53e3e",
                "&:hover": { backgroundColor: "#c53030" },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Update Product"}
            </Button>
          </Box>
        </Box>
      </StyledPaper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert elevation={6} variant="filled" severity={snackbar.severity}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">
          Confirm Product Update
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Are you sure you want to update this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmUpdate}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={subcategoryModalOpen}
        onClose={handleCloseSubcategoryModal}
        aria-labelledby="subcategory-dialog-title"
        aria-describedby="subcategory-dialog-description"
      >
        <DialogTitle id="subcategory-dialog-title">
          Select Subcategories
          <IconButton
            aria-label="close"
            onClick={handleCloseSubcategoryModal}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="subcategory-dialog-description">
            Choose the subcategories for this product.
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            {subcategories.map((subcategory) => (
              <Chip
                key={subcategory._id}
                label={subcategory.name}
                onClick={() => handleSubcategorySelect(subcategory._id)}
                color={
                  product.subcategories.includes(subcategory._id)
                    ? "primary"
                    : "default"
                }
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSubcategoryModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UpdateProduct;
