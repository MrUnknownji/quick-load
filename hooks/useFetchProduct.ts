import { useState, useEffect, useCallback } from "react";
import {
  getProducts,
  getProductById,
  getProductsByOwnerAndType,
  getProductOwnersByType,
  addNewProduct,
  addNewProductOwner,
  updateExistingProduct,
  updateExistingProductOwner,
  getProductsByUserId,
  getProductOwners,
  getProductOwnerByUserId,
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

export const useFetchProductById = (productId: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductById(productId);
      setProduct(data);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to fetch product");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, loading, error, fetchProduct };
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

export const useFetchProductOwnerByUserId = () => {
  const [productOwner, setProductOwner] = useState<ProductOwner | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductOwner = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductOwnerByUserId();
      setProductOwner(data);
    } catch (err) {
      console.error("Error fetching product owner:", err);
      setError("Failed to fetch product owner");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductOwner();
  }, [fetchProductOwner]);

  return { productOwner, loading, error, fetchProductOwner };
};

export const useFetchProductsByOwnerAndType = (
  productOwner: string,
  productType: string,
) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (owner: string, type: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductsByOwnerAndType(owner, type);
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(productOwner, productType);
  }, [productOwner, productType, fetchProducts]);

  return { products, loading, error, fetchProducts };
};

export const useAddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addProduct = async (
    productData: FormData,
  ): Promise<Product | undefined> => {
    setLoading(true);
    try {
      const result = await addNewProduct(productData);
      setLoading(false);
      return result;
    } catch (err) {
      console.log("Error adding product:", err);
      setError("Failed to add product");
      setLoading(false);
    }
  };

  return { addProduct, loading, error };
};

export const useUpdateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProduct = async (
    productId: string,
    productData: FormData,
  ): Promise<Product | undefined> => {
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

export const useAddProductOwner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addProductOwner = async (productOwnerData: FormData) => {
    console.log("addProductOwner", productOwnerData);
    setLoading(true);
    try {
      const result = await addNewProductOwner(productOwnerData);
      setLoading(false);
      return result;
    } catch (err) {
      console.log("Error adding product owner:", err);
      setError("Failed to add product owner");
      setLoading(false);
    }
  };

  return { addProductOwner, loading, error };
};

export const useUpdateProductOwner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProductOwner = async (
    ownerId: string,
    productOwnerData: FormData,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateExistingProductOwner(
        ownerId,
        productOwnerData,
      );
      setLoading(false);
      return result;
    } catch (err) {
      console.error("Error updating product owner:", err);
      setError("Failed to update product owner");
      setLoading(false);
      throw err;
    }
  };

  return { updateProductOwner, loading, error };
};

export const useFetchProductOwners = () => {
  const [productOwners, setProductOwners] = useState<ProductOwner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductOwners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductOwners();
      setProductOwners(data);
    } catch (err) {
      console.error("Error fetching product owners:", err);
      setError("Failed to fetch product owners");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductOwners();
  }, [fetchProductOwners]);

  return { productOwners, loading, error, fetchProductOwners };
};

export const useFetchProductsByUserId = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductsByUserId();
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

export const useDeleteProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteProduct = async (productId: string) => {
    setLoading(true);
    setError(null);
    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`Product ${productId} deleted`);
      setLoading(false);
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product");
      setLoading(false);
    }
  };

  return { deleteProduct, loading, error };
};
