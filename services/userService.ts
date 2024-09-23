import {
  deleteUser,
  getUserInfo,
  editUserProfile,
  loginUser,
  logoutUser,
  refreshToken as refreshTokenApi,
} from "../api/userApi";
import { User, UserEdit } from "../types/User";

export const deleteUserAccount = async (token: string): Promise<void> => {
  await deleteUser(token);
};

export const getCurrentUser = async (token: string): Promise<User> => {
  return await getUserInfo(token);
};

export const updateUserProfile = async (
  token: string,
  userData: FormData,
): Promise<any> => {
  return await editUserProfile(token, userData);
};

export const loginUserAccount = async (accessToken: string): Promise<any> => {
  return await loginUser(accessToken);
};

export const logoutUserAccount = async (token: string): Promise<void> => {
  await logoutUser(token);
};

export const refreshUserToken = async (refreshToken: string): Promise<any> => {
  return await refreshTokenApi(refreshToken);
};
