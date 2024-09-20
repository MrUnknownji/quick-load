import { useState, useEffect } from "react";
import {
  addNewRoute,
  getDrivers,
  getMerchants,
} from "../services/vehicleService";
import { Driver, Merchant, RouteData } from "../types/Vehicle";

export const useAddRoute = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addRoute = async (routeData: RouteData) => {
    setLoading(true);
    try {
      const result = await addNewRoute(routeData);
      setLoading(false);
      return result;
    } catch (err) {
      setError("Failed to add route");
      setLoading(false);
    }
  };

  return { addRoute, loading, error };
};

export const useFetchDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDrivers();
        setDrivers(data);
      } catch (err) {
        setError("Failed to fetch drivers");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { drivers, loading, error };
};

export const useFetchMerchants = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMerchants();
        setMerchants(data);
      } catch (err) {
        setError("Failed to fetch merchants");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { merchants, loading, error };
};
