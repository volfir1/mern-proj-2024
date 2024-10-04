import React, { useState } from "react";
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
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
}));

const ImagePreview = styled("img")({
    width: "100%",
    height: "auto",
    marginTop: "10px",
});

const CreateProduct = () => {
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        inStock: true,
        imageUrl: "",
    });
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const handleChange = (event) => {
        const { name, value, checked } = event.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: name === "inStock" ? checked : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("http://localhost:3000/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            });

            if (!response.ok) {
                throw new Error("Failed to create product");
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
            console.error("Error creating product:", error);
            setSnackbar({
                open: true,
                message: "Error creating product",
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
        <Container maxWidth="md">
            <StyledPaper elevation={3}>
                <Typography variant="h4" gutterBottom>
                    Create New Product
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Product Name"
                                name="name"
                                value={product.name}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                label="Category"
                                name="category"
                                value={product.category}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                multiline
                                rows={4}
                                label="Description"
                                name="description"
                                value={product.description}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                type="number"
                                label="Price"
                                name="price"
                                value={product.price}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: <Typography>$</Typography>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Image URL"
                                name="imageUrl"
                                value={product.imageUrl}
                                onChange={handleChange}
                            />
                        </Grid>
                        {product.imageUrl && (
                            <Grid item xs={12}>
                                <ImagePreview
                                    src={product.imageUrl}
                                    alt="Product preview"
                                />
                            </Grid>
                        )}
                        <Grid item xs={12}>
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
                        </Grid>
                        <Grid item xs={12}>
                            <Box
                                display="flex"
                                justifyContent="flex-end"
                                gap={2}
                            >
                                <Button
                                    variant="outlined"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} />
                                    ) : (
                                        "Create Product"
                                    )}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </StyledPaper>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </MuiAlert>
            </Snackbar>
        </Container>
    );
};

export default CreateProduct;
