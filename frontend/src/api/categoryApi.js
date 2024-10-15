// categoryApi.js

const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return await response.json();
};

export const fetchCategories = async () => {
  const response = await fetch("/api/category-list");
  const data = await handleResponse(response);
  return data.categories;
};

export const createCategory = async (category) => {
  const response = await fetch("/api/category", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });
  return await handleResponse(response);
};

export const updateCategory = async (id, category) => {
  const response = await fetch(`/api/category/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });
  return await handleResponse(response);
};

export const deleteCategory = async (id) => {
  const response = await fetch(`/api/category-delete/${id}`, {
    method: "DELETE",
  });
  await handleResponse(response);
};

// Sub Category API

export const createSubcategory = async (id, subcategory) => {
  const response = await fetch(`/api/category/${id}/subcategories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ subcategories: [subcategory] }),
  });
  return await handleResponse(response);
};

export const updateSubcategory = async (id, subcategory) => {
  const response = await fetch(`/api/subcategory/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subcategory),
  });
  return await handleResponse(response);
};

export const deleteSubcategory = async (id) => {
  const response = await fetch(`/api/subcategory/${id}`, {
    method: "DELETE",
  });
  await handleResponse(response);
};
