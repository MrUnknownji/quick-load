import { useState, useEffect, useCallback } from "react";
import {
  getProducts,
  getProductOwnersByType,
  getProductsByOwnerAndType,
  addNewProduct,
  addNewProductOwner,
  updateExistingProduct,
} from "../services/productService";
import { Product, ProductOwner } from "../types/Product";

export const useFetchProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      console.log("Fetched products:", data);
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, fetchProducts };
};

export const useFetchProductOwnersByType = (productType: string) => {
  const [productOwners, setProductOwners] = useState<ProductOwner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOwners = useCallback(async (type: string) => {
    setLoading(true);
    try {
      const data = await getProductOwnersByType(type);
      setProductOwners(data);
    } catch (err) {
      setError("Failed to fetch product owners");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOwners(productType);
  }, [productType, fetchOwners]);

  return { productOwners, loading, error, fetchOwners };
};

export const useFetchProductsByOwnerAndType = (
  productOwner: string,
  productType: string,
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

export const useAddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addProduct = async (productData: FormData) => {
    setLoading(true);
    try {
      const result = await addNewProduct(productData);
      setLoading(false);
      return result;
    } catch (err) {
      setError("Failed to add product");
      setLoading(false);
    }
  };

  return { addProduct, loading, error };
};

export const useAddProductOwner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addProductOwner = async (productOwnerData: FormData) => {
    setLoading(true);
    try {
      const result = await addNewProductOwner(productOwnerData);
      setLoading(false);
      return result;
    } catch (err) {
      setError("Failed to add product owner");
      setLoading(false);
    }
  };

  return { addProductOwner, loading, error };
};

export const useUpdateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProduct = async (productId: string, productData: FormData) => {
    setLoading(true);
    try {
      const result = await updateExistingProduct(productId, productData);
      setLoading(false);
      return result;
    } catch (err) {
      setError("Failed to update product");
      setLoading(false);
    }
  };

  return { updateProduct, loading, error };
};
