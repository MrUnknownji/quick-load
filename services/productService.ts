import { fetchProducts, fetchProductById } from "../api/productApi";
import { Product } from "../types/Product";

export const getProducts = async (): Promise<Product[]> => {
  return await fetchProducts();
};

export const getProductById = async (id: string): Promise<Product> => {
  return await fetchProductById(id);
};
