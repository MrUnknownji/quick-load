import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosRequestConfig,
} from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { RefreshTokenResponse } from "@/types/User";

export const baseURL = "https://movingrolls.online/api";

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
      console.log("Request interceptor - Token used:", token);
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Request config:", JSON.stringify(config, null, 2));
    return config;
  },
  (error: unknown) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  },
);

authApiClient.interceptors.response.use(
  (response) => {
    console.log(
      "Response interceptor - Success:",
      response.status,
      response.data,
    );
    return response;
  },
  async (error: AxiosError) => {
    console.log(
      "Response interceptor - Error:",
      error.response?.status,
      error.response?.data,
    );
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("Attempting to refresh tokens...");
        const { accessToken, refreshToken } = await refreshTokens();
        await AsyncStorage.setItem("accessToken", accessToken);
        await AsyncStorage.setItem("refreshToken", refreshToken);
        console.log(
          "Tokens refreshed successfully. New access token:",
          accessToken,
        );

        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        console.log("Retrying original request with new token");
        return authApiClient(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");
        router.dismissAll();
        router.push("/authentication");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export const refreshTokens = async () => {
  const refreshToken = await AsyncStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    console.log("Sending refresh token request");
    const response = await apiClient.post<RefreshTokenResponse>(
      "/user/refresh-token",
      { refreshToken },
    );
    console.log("Refresh token response:", response.data);
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.error("Failed to refresh tokens:", error);
    throw error;
  }
};

export { apiClient, authApiClient };
