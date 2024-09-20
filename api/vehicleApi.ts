import apiClient from "./apiClient";

export const addRoute = async (routeData: {
  userType: string;
  from: string;
  to: string;
  vehicle: string;
  selfVehicleId?: string;
}) => {
  const response = await apiClient.post("/routes/add", routeData);
  return response.data;
};

export const fetchDrivers = async () => {
  const response = await apiClient.get("/routes/drivers");
  return response.data.drivers;
};

export const fetchMerchants = async () => {
  const response = await apiClient.get("/routes/merchants");
  return response.data.merchants;
};
