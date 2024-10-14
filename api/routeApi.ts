import { authApiClient } from "./apiClient";
import { Route, Driver, Merchant } from "../types/Route";

export const addRoute = async (routeData: Route): Promise<string> => {
  console.log("Adding route with data: ", routeData);
  const response = await authApiClient.post("/routes/add", routeData);
  console.log("Response is", response);
  return response.data;
};

export const fetchDrivers = async (): Promise<Driver[]> => {
  const response = await authApiClient.get("/routes/drivers");
  return response.data.drivers;
};

export const fetchMerchantDrivers = async (): Promise<Merchant[]> => {
  const response = await authApiClient.get("/routes/merchantdriver");
  return response.data.merchantdriver;
};

export const fetchMerchants = async (): Promise<Merchant[]> => {
  const response = await authApiClient.get("/routes/merchants");
  return response.data.merchants;
};
