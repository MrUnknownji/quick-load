import apiClient from "./apiClient";

export const fetchProducts = async () => {
  const response = await apiClient.get("/product/list");
  return response.data.products;
};

export const fetchProductById = async (productId: string) => {
  const response = await apiClient.get(`/product/${productId}`);
  return response.data.product;
};

export const fetchProductsByType = async (
  productOwner: string,
  productType: string
) => {
  const response = await apiClient.get(
    `/product/listByType?productOwner=${productOwner}&productType=${productType}`
  );
  return response.data.products;
};

export const fetchProductOwnersByType = async (productType: string) => {
  const response = await apiClient.get(
    `/product/ownerlistByType?productType=${productType}`
  );
  return response.data.productOwners;
};

// Add functions for addProduct and addProductOwner if needed.
// You'll need to handle multipart/form-data for image uploads.
