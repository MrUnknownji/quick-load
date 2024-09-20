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
  productType: string,
) => {
  const response = await apiClient.get(
    `/product/listByType?productOwner=${productOwner}&productType=${productType}`,
  );
  return response.data.products;
};

export const fetchProductOwnersByType = async (productType: string) => {
  const response = await apiClient.get(
    `/product/ownerlistByType?productType=${productType}`,
  );
  return response.data.productOwners;
};

export const addProduct = async (productData: FormData) => {
  const response = await apiClient.post("/product/add", productData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.product;
};

export const addProductOwner = async (productOwnerData: FormData) => {
  const response = await apiClient.post(
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
  const response = await apiClient.put(`/product/${productId}`, productData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.product;
};
