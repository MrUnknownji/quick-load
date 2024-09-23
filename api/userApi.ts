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

export const loginUser = async (accessToken: string) => {
  const response = await apiClient.post("/user/firebase-login", {
    access_token: accessToken,
  });
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
