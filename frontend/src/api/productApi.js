const API_BASE_URL = "/api";

export const fetchProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/prod-list`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const fetchCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/category-list`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const createProduct = async (productData) => {
  const response = await fetch(`${API_BASE_URL}/prod-create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    throw new Error("Failed to create product");
  }
  return response.json();
};

export const updateProduct = async (productId, productData) => {
  const response = await fetch(`${API_BASE_URL}/prod-update/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });
  if (!response.ok) {
    throw new Error("Failed to update product");
  }
  return response.json();
};

export const deleteProduct = async (productId, publicId) => {
  const response = await fetch(`${API_BASE_URL}/prod-delete/${productId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Public-Id": publicId,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete product");
  }
  return response.json();
};
