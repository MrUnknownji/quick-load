import {
  fetchProducts,
  fetchProductById,
  fetchProductsByType,
  fetchProductOwnersByType,
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
  type: string
): Promise<Product[]> => {
  return await fetchProductsByType(owner, type);
};

export const getProductOwnersByType = async (
  type: string
): Promise<ProductOwner[]> => {
  return await fetchProductOwnersByType(type);
};
