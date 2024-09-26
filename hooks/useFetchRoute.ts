import { useState, useEffect, useCallback } from "react";
import {
  createNewRoute,
  getDrivers,
  getMerchantDrivers,
  getMerchants,
} from "../services/routeService";
import { Route, Driver, Merchant } from "../types/Route";

export const useAddRoute = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addRoute = async (routeData: Route) => {
    setLoading(true);
    try {
      const result = await createNewRoute(routeData);
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

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDrivers();
      setDrivers(data);
    } catch (err) {
      setError("Failed to fetch drivers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  return { drivers, loading, error, fetchDrivers };
};

export const useFetchMerchantDrivers = () => {
  const [merchantDrivers, setMerchantDrivers] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMerchantDrivers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMerchantDrivers();
      setMerchantDrivers(data);
    } catch (err) {
      setError("Failed to fetch merchant drivers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMerchantDrivers();
  }, [fetchMerchantDrivers]);

  return { merchantDrivers, loading, error, fetchMerchantDrivers };
};

export const useFetchMerchants = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMerchants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMerchants();
      setMerchants(data);
    } catch (err) {
      setError("Failed to fetch merchants");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMerchants();
  }, [fetchMerchants]);

  return { merchants, loading, error, fetchMerchants };
};
