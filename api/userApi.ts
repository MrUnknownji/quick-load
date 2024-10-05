import { apiClient, authApiClient } from "./apiClient";

export const deleteUser = async (userId: string) => {
  const response = await authApiClient.delete(`/user/${userId}`);
  return response.data;
};

export const getUserInfo = async (userId: string) => {
  const response = await authApiClient.get(`/user/${userId}`);
  return response.data.user;
};

export const editUserProfile = async (userId: string, userData: FormData) => {
  const response = await authApiClient.put(`/user/${userId}`, userData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.user;
};

export const loginUser = async (accessToken: string) => {
  const response = await apiClient.post("/user/firebase-login", {
    access_token: accessToken,
  });
  return response.data;
};
