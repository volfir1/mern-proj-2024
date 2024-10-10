import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Snackbar,
  CircularProgress,
  Box,
  FormControlLabel,
  Switch,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate, useParams } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
}));

const ImagePreview = styled("img")({
  width: "100%",
  height: 300,
  objectFit: "cover",
  borderRadius: 8,
  cursor: "pointer",
});

const ImagePlaceholder = styled(Box)(({ theme }) => ({
  width: "100%",
  height: 300,
  backgroundColor: "#f0f0f0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 8,
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#e0e0e0",
  },
}));

const StyledTextField = styled(TextField)({
  marginBottom: 16,
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
  },
});

const UpdateProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    inStock: false,
    stockQuantity: "",
    rating: 0,
    imageUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmDialog, setConfirmDialog] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/prod-change/${id}`);
        const data = response.data.product;
        setProduct(data);
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
    fetchProduct();
  }, [id]);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: type === "checkbox" ? checked : value,
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
    setConfirmDialog(true);
  };

  const handleConfirmUpdate = async () => {
    setConfirmDialog(false);
    setLoading(true);

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

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <StyledPaper elevation={3}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ textAlign: "center", fontWeight: "bold", marginBottom: 4 }}
          >
            Update Product
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              {/* Left Side: Image */}
              <Grid item xs={12} md={6}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
                {imagePreview ? (
                  <ImagePreview
                    src={imagePreview}
                    alt="Product preview"
                    onClick={handleImageClick}
                  />
                ) : (
                  <ImagePlaceholder onClick={handleImageClick}>
                    <Typography variant="h6">
                      Click or drag to upload image
                    </Typography>
                  </ImagePlaceholder>
                )}
                <Typography variant="caption" display="block" gutterBottom>
                  {imageFile
                    ? `Selected file: ${imageFile.name}`
                    : "No file selected"}
                </Typography>
              </Grid>

              {/* Right Side: Form Fields */}
              <Grid item xs={12} md={6}>
                <StyledTextField
                  required
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                />
                <StyledTextField
                  required
                  fullWidth
                  label="Category"
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                />
                <StyledTextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                />
                <StyledTextField
                  required
                  fullWidth
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
                />
                {product.inStock && (
                  <StyledTextField
                    required
                    fullWidth
                    type="number"
                    label="Stock Quantity"
                    name="stockQuantity"
                    value={product.stockQuantity}
                    onChange={handleChange}
                  />
                )}
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 4,
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{ borderRadius: 4 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ borderRadius: 4 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Update Product"
                )}
              </Button>
            </Box>
          </form>
        </StyledPaper>
      </Box>

      {/* Snackbar for alerts */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to update this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmUpdate} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UpdateProduct;
