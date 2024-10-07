import { authApiClient } from "./apiClient";
import { Product, ProductOwner } from "../types/Product";

export const fetchProducts = async () => {
  const response = await authApiClient.get("/product/list");
  return response.data.products;
};

export const fetchProductOwners = async () => {
  const response = await authApiClient.get("/product/productOwner/list");
  return response.data.productOwners;
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

export const fetchProductsByUserId = async () => {
  const response = await authApiClient.get("/product/productlistbyuserId");
  return response.data.products;
};

export const addProduct = async (productData: FormData): Promise<Product> => {
  const response = await authApiClient.post("/product/add", productData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.product;
};

export const fetchProductOwnerByUserId = async () => {
  const response = await authApiClient.get(
    "/product/owner/productOwnerByUserId",
  );
  return response.data.productOwner;
};

export const addProductOwner = async (
  productOwnerData: FormData,
): Promise<ProductOwner> => {
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
): Promise<Product> => {
  const response = await authApiClient.put(
    `/product/${productId}`,
    productData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data.product;
};

export const updateProductOwner = async (
  ownerId: string,
  productOwnerData: FormData,
): Promise<ProductOwner> => {
  const response = await authApiClient.put(
    `/product/owner/${ownerId}`,
    productOwnerData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data.productOwner;
};
