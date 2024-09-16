import { useState, useEffect } from "react";
import {
  getProducts,
  getProductOwnersByType,
  getProductsByOwnerAndType,
} from "../services/productService";
import { Product, ProductOwner } from "../types/Product";

export const useFetchProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { products, loading, error };
};

export const useFetchProductOwnersByType = (productType: string) => {
  const [productOwners, setProductOwners] = useState<ProductOwner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const data = await getProductOwnersByType(productType);
        setProductOwners(data);
      } catch (err) {
        setError("Failed to fetch product owners");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productType]);

  return { productOwners, loading, error };
};

export const useFetchProductsByOwnerAndType = (
  productOwner: string,
  productType: string
) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProductsByOwnerAndType(productOwner, productType);
        setProducts(data);
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productOwner, productType]);

  return { products, loading, error };
};
