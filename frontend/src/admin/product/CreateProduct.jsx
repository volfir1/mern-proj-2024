import React, { useState, useRef } from "react";
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
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "#f8f9fa",
  padding: theme.spacing(3),
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  height: "calc(100vh - 48px)", // Subtract some padding
  display: "flex",
  flexDirection: "column",
}));

const ImageUploader = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
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

const CreateProduct = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    inStock: false,
    stockQuantity: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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
    setConfirmOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setLoading(true);
    setConfirmOpen(false);

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("category", product.category);
      formData.append("inStock", product.inStock);
      formData.append(
        "stockQuantity",
        product.inStock ? product.stockQuantity : 0
      );

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create product");
      }

      setSnackbar({
        open: true,
        message: "Product created successfully",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/admin/products");
      }, 2000);
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error creating product: ${error.message}`,
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

  return (
    <Container maxWidth="lg" sx={{ py: 2, height: "100vh" }}>
      <StyledPaper>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 300, textAlign: "center", mb: 3 }}
        >
          Create New Product
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
          <Grid container spacing={3} sx={{ flexGrow: 1 }}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
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
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <StyledTextField
                  fullWidth
                  required
                  label="Product Name"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                />
                <StyledTextField
                  fullWidth
                  required
                  label="Category"
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                />
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
              </Box>
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
              {loading ? <CircularProgress size={24} /> : "Create Product"}
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
          Confirm Product Creation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Are you sure you want to create this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmSubmit}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateProduct;
