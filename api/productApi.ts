import apiClient from "./apiClient";

export const fetchProducts = async () => {
  const response = await apiClient.get("/product/list");
  return response.data.products;
};

export const fetchProductById = async (productId: string) => {
  const response = await apiClient.get(`/product/${productId}`);
  return response.data.product;
};
