import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = "https://quick-load.onrender.com/api";

const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});

const authApiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});

authApiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export { apiClient, authApiClient };
