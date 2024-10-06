import { authApiClient } from "./apiClient";
import { Location, LocationUpdate, ApiResponse } from "../types/Location";

export const addLocation = async (
  locationData: Location,
): Promise<ApiResponse<string>> => {
  const response = await authApiClient.post("/location/add", locationData);
  return response.data;
};

export const fetchLocation = async (
  userId: string,
): Promise<ApiResponse<Location>> => {
  const response = await authApiClient.get(`/location/${userId}`);
  return response.data;
};

export const updateLocation = async (
  userId: string,
  locationUpdate: LocationUpdate,
): Promise<ApiResponse<Location>> => {
  const response = await authApiClient.put(
    `/location/update/${userId}`,
    locationUpdate,
  );
  return response.data;
};
