import { useState, useEffect, useCallback } from "react";
import {
  getVehicles,
  getVehicleById,
  addNewVehicle,
  updateExistingVehicle,
  removeVehicle,
  getVehicleTypes,
  getVehiclesByUserId,
} from "../services/vehicleService";
import { Vehicle, VehicleFormState, VehicleType } from "../types/Vehicle";

export const useFetchVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVehicles();
      setVehicles(data);
    } catch (err) {
      setError("Failed to fetch vehicles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return { vehicles, loading, error, fetchVehicles };
};

export const useFetchVehicleById = (vehicleId: string) => {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      setLoading(true);
      try {
        const data = await getVehicleById(vehicleId);
        setVehicle(data);
      } catch (err) {
        setError("Failed to fetch vehicle");
        console.log("Error is ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId]);

  return { vehicle, loading, error };
};

export const useAddVehicle = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addVehicle = async (vehicleData: FormData) => {
    setLoading(true);
    try {
      const result = await addNewVehicle(vehicleData);
      setLoading(false);
      return result;
    } catch (err) {
      setError("Failed to add vehicle");
      setLoading(false);
    }
  };

  return { addVehicle, loading, error };
};

export const useUpdateVehicle = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateVehicle = async (
    vehicleId: string,
    formData: FormData,
  ): Promise<Vehicle> => {
    setLoading(true);
    try {
      const result = await updateExistingVehicle(vehicleId, formData);
      setLoading(false);
      if (result && "vehicleId" in result) {
        return result as Vehicle;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.log("Error in update: ", err);
      setError("Failed to update vehicle: " + err);
      setLoading(false);
      throw err;
    }
  };

  return { updateVehicle, loading, error };
};

export const useDeleteVehicle = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteVehicle = async (vehicleId: string) => {
    setLoading(true);
    try {
      const result = await removeVehicle(vehicleId);
      setLoading(false);
      return result;
    } catch (err) {
      setError("Failed to delete vehicle");
      setLoading(false);
    }
  };

  return { deleteVehicle, loading, error };
};

export const useFetchVehicleTypes = () => {
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicleTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVehicleTypes();
      setVehicleTypes(data);
    } catch (err) {
      setError("Failed to fetch vehicle types");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicleTypes();
  }, [fetchVehicleTypes]);

  return { vehicleTypes, loading, error, fetchVehicleTypes };
};

export const useFetchVehiclesByUserId = (userId: string) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVehiclesByUserId(userId);
      setVehicles(data);
    } catch (err) {
      setError("Failed to fetch vehicles for user");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return { vehicles, loading, error, fetchVehicles };
};
