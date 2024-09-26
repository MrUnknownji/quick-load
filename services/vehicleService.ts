import {
  fetchVehicles,
  fetchVehicleById,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  fetchVehicleTypes,
  fetchVehiclesByUserId,
} from "../api/vehicleApi";
import { Vehicle, VehicleType } from "../types/Vehicle";

export const getVehicles = async (): Promise<Vehicle[]> => {
  return await fetchVehicles();
};

export const getVehicleById = async (id: string): Promise<Vehicle> => {
  return await fetchVehicleById(id);
};

export const addNewVehicle = async (
  vehicleData: FormData,
): Promise<Vehicle> => {
  return await addVehicle(vehicleData);
};

export const updateExistingVehicle = async (
  vehicleId: string,
  vehicleData: FormData,
): Promise<Vehicle> => {
  return await updateVehicle(vehicleId, vehicleData);
};

export const removeVehicle = async (vehicleId: string): Promise<string> => {
  return await deleteVehicle(vehicleId);
};

export const getVehicleTypes = async (): Promise<VehicleType[]> => {
  return await fetchVehicleTypes();
};

export const getVehiclesByUserId = async (
  userId: string,
): Promise<Vehicle[]> => {
  return await fetchVehiclesByUserId(userId);
};
