import { useState, useEffect } from "react";
import { getBrands } from "../services/brandService";
import { Brand } from "../types/Brand";

export const useFetchBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (err) {
        setError("Failed to fetch brands");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { brands, loading, error };
};
