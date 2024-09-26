import { authApiClient } from "./apiClient";
import { Vehicle, VehicleType, ApiResponse } from "../types/Vehicle";

export const fetchVehicles = async (): Promise<Vehicle[]> => {
  const response =
    await authApiClient.get<ApiResponse<{ vehicles: Vehicle[] }>>(
      "/vehicle/list",
    );
  return response.data.vehicles;
};

export const fetchVehicleById = async (vehicleId: string): Promise<Vehicle> => {
  const response = await authApiClient.get<ApiResponse<{ vehicle: Vehicle }>>(
    `/vehicle/${vehicleId}`,
  );
  return response.data.vehicle;
};

export const addVehicle = async (vehicleData: FormData): Promise<Vehicle> => {
  const response = await authApiClient.post<ApiResponse<{ vehicle: Vehicle }>>(
    "/vehicle/add",
    vehicleData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data.vehicle;
};

export const updateVehicle = async (
  vehicleId: string,
  vehicleData: FormData,
): Promise<Vehicle> => {
  const response = await authApiClient.put<ApiResponse<{ vehicle: Vehicle }>>(
    `/vehicle/${vehicleId}`,
    vehicleData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data.vehicle;
};

export const deleteVehicle = async (vehicleId: string): Promise<string> => {
  const response = await authApiClient.delete<ApiResponse<{ vehicle: string }>>(
    `/vehicle/${vehicleId}`,
  );
  return response.data.vehicle;
};

export const fetchVehicleTypes = async (): Promise<VehicleType[]> => {
  const response =
    await authApiClient.get<ApiResponse<{ vehicleTypes: VehicleType[] }>>(
      "/vehicle/types",
    );
  return response.data.vehicleTypes;
};

export const fetchVehiclesByUserId = async (
  userId: string,
): Promise<Vehicle[]> => {
  const response = await authApiClient.get<
    ApiResponse<{ vehicles: Vehicle[] }>
  >(`/vehicle/list/${userId}`);
  return response.data.vehicles;
};
