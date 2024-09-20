import { addRoute, fetchDrivers, fetchMerchants } from "../api/vehicleApi";
import { Driver, Merchant, RouteData } from "../types/Vehicle";

export const addNewRoute = async (routeData: RouteData): Promise<any> => {
  return await addRoute(routeData);
};

export const getDrivers = async (): Promise<Driver[]> => {
  return await fetchDrivers();
};

export const getMerchants = async (): Promise<Merchant[]> => {
  return await fetchMerchants();
};
