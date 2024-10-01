import { authApiClient } from "./apiClient";
import { ApiResponse, Product, ProductOwner } from "../types/Product";

export const fetchProducts = async () => {
  const response = await authApiClient.get("/product/list");
  return response.data.products;
};

export const fetchProductById = async (productId: string) => {
  const response = await authApiClient.get(`/product/${productId}`);
  return response.data.product;
};

export const fetchProductsByType = async (
  productOwner: string,
  productType: string,
) => {
  const response = await authApiClient.get(
    `/product/listByType?productOwner=${productOwner}&productType=${productType}`,
  );
  return response.data.products;
};

export const fetchProductOwnersByType = async (productType: string) => {
  const response = await authApiClient.get(
    `/product/ownerlistByType?productType=${productType}`,
  );
  return response.data.productOwners;
};

export const addProduct = async (productData: FormData) => {
  const response = await authApiClient.post("/product/add", productData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.product;
};

export const addProductOwner = async (productOwnerData: FormData) => {
  const response = await authApiClient.post(
    "/product/addProductOwner",
    productOwnerData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data.product;
};

export const updateProduct = async (
  productId: string,
  productData: FormData,
) => {
  const response = await authApiClient.put(
    `/product/${productId}`,
    productData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
};

export const updateProductOwner = async (
  ownerId: string,
  productOwnerData: FormData,
) => {
  const response = await authApiClient.put(
    `/product/owner/${ownerId}`,
    productOwnerData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
};
