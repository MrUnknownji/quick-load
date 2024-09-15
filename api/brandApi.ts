import apiClient from "./apiClient";

export const fetchBrands = async () => {
  const response = await apiClient.get("/brands");
  return response.data;
};

export const addBrand = async (brandData: { name: string; owner: string }) => {
  const response = await apiClient.post("/brands", brandData);
  return response.data;
};
