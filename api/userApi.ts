import apiClient from "./apiClient";

export const deleteUser = async (token: string) => {
  const response = await apiClient.delete("/user", {
    headers: { Authorization: token },
  });
  return response.data;
};

export const getUserInfo = async (token: string) => {
  const response = await apiClient.get("/user", {
    headers: { Authorization: token },
  });
  return response.data.user;
};

export const editUserProfile = async (token: string, userData: FormData) => {
  const response = await apiClient.put("/user", userData, {
    headers: { Authorization: token, "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const registerUser = async (userData: any) => {
  const response = await apiClient.post("/user", userData);
  return response.data;
};

export const loginUser = async (credentials: any) => {
  const response = await apiClient.post("/user/login", credentials);
  return response.data;
};

export const logoutUser = async (token: string) => {
  const response = await apiClient.post("/user/logout", null, {
    headers: { Authorization: token },
  });
  return response.data;
};

export const refreshToken = async (refreshToken: string) => {
  const response = await apiClient.post("/user/refresh-token", {
    refreshToken,
  });
  return response.data;
};

export const sendOTP = async (phone: string) => {
  const response = await apiClient.post("/user/send-otp", { phone });
  return response.data;
};

export const verifyOTP = async (phone: string, otp: string) => {
  const response = await apiClient.post("/user/verify-otp", { phone, otp });
  return response.data;
};
