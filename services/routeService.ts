import {
  addRoute,
  fetchDrivers,
  fetchMerchantDrivers,
  fetchMerchants,
} from "../api/routeApi";
import { Route, Driver, Merchant } from "../types/Route";

export const createNewRoute = async (routeData: Route): Promise<string> => {
  return await addRoute(routeData);
};

export const getDrivers = async (): Promise<Driver[]> => {
  return await fetchDrivers();
};

export const getMerchantDrivers = async (): Promise<Merchant[]> => {
  return await fetchMerchantDrivers();
};

export const getMerchants = async (): Promise<Merchant[]> => {
  return await fetchMerchants();
};
