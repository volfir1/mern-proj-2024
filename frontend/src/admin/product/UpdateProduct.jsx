import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import ProductForm from './ProductForm';
import { useProductManager } from '../../hooks/productManager';

const StyledPaper = styled(Box)(({ theme }) => ({
  backgroundColor: "#f8f9fa",
  padding: theme.spacing(3),
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  minHeight: "calc(100vh - 48px)",
  display: "flex",
  flexDirection: "column",
}));

const UpdateProduct = () => {
  const { id } = useParams();
  const {
    product,
    setProduct,
    loading,
    categories,
    subcategories,
    fetchCategories,
    fetchProduct,
    handleUpdateProduct,
  } = useProductManager(id);

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, [id, fetchCategories, fetchProduct]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    Object.entries(product).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, Array.isArray(value) ? JSON.stringify(value) : value);
      }
    });
    await handleUpdateProduct(id, formData);
  };

  if (loading) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <StyledPaper>
        <Typography variant="h4" gutterBottom sx={{ mb: 3, textAlign: "center" }}>
          Update Product
        </Typography>
        <ProductForm
          product={product}
          setProduct={setProduct}
          handleSubmit={handleSubmit}
          categories={categories}
          subcategories={subcategories}
          isLoading={loading}
          submitButtonText="Update Product"
        />
      </StyledPaper>
    </Container>
  );
};

export default UpdateProduct;