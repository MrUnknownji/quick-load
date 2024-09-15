import { fetchBrands, addBrand } from "../api/brandApi";
import { Brand } from "../types/Brand";

export const getBrands = async (): Promise<Brand[]> => {
  return await fetchBrands();
};

export const createBrand = async (
  name: string,
  owner: string
): Promise<Brand> => {
  return await addBrand({ name, owner });
};
