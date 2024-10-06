import { useState, useCallback } from "react";
import {
  createNewLocation,
  getLocation,
  updateUserLocation,
} from "../services/locationService";
import { Location, LocationUpdate, ApiResponse } from "../types/Location";

export const useAddLocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addLocation = async (locationData: Location) => {
    setLoading(true);
    try {
      const result = await createNewLocation(locationData);
      setLoading(false);
      return result;
    } catch (err) {
      console.error("Error adding location:", err);
      setError("Failed to add location");
      setLoading(false);
    }
  };

  return { addLocation, loading, error };
};

export const useFetchLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getLocation(userId);
      setLocation(result.data);
    } catch (err) {
      console.error("Error fetching location:", err);
      setError("Failed to fetch location");
    } finally {
      setLoading(false);
    }
  }, []);

  return { location, loading, error, fetchLocation };
};

export const useUpdateLocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateLocation = async (
    userId: string,
    locationUpdate: LocationUpdate,
  ) => {
    setLoading(true);
    try {
      const result = await updateUserLocation(userId, locationUpdate);
      setLoading(false);
      return result;
    } catch (err) {
      console.error("Error updating location:", err);
      setError("Failed to update location");
      setLoading(false);
    }
  };

  return { updateLocation, loading, error };
};
