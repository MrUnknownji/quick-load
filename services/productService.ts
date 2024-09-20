import {
  fetchProducts,
  fetchProductById,
  fetchProductsByType,
  fetchProductOwnersByType,
  addProduct,
  addProductOwner,
  updateProduct,
} from "../api/productApi";
import { Product, ProductOwner } from "../types/Product";

export const getProducts = async (): Promise<Product[]> => {
  return await fetchProducts();
};

export const getProductById = async (id: string): Promise<Product> => {
  return await fetchProductById(id);
};

export const getProductsByOwnerAndType = async (
  owner: string,
  type: string,
): Promise<Product[]> => {
  return await fetchProductsByType(owner, type);
};

export const getProductOwnersByType = async (
  type: string,
): Promise<ProductOwner[]> => {
  return await fetchProductOwnersByType(type);
};

export const addNewProduct = async (
  productData: FormData,
): Promise<Product> => {
  return await addProduct(productData);
};

export const addNewProductOwner = async (
  productOwnerData: FormData,
): Promise<ProductOwner> => {
  return await addProductOwner(productOwnerData);
};

export const updateExistingProduct = async (
  productId: string,
  productData: FormData,
): Promise<Product> => {
  return await updateProduct(productId, productData);
};
