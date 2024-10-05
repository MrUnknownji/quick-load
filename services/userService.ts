import {
  deleteUser,
  getUserInfo,
  editUserProfile,
  loginUser,
} from "../api/userApi";
import { User } from "../types/User";

export const deleteUserAccount = async (userId: string): Promise<void> => {
  await deleteUser(userId);
};

export const getCurrentUser = async (userId: string): Promise<User> => {
  return await getUserInfo(userId);
};

export const updateUserProfile = async (
  userId: string,
  userData: FormData,
): Promise<User> => {
  return await editUserProfile(userId, userData);
};

export const loginUserAccount = async (accessToken: string): Promise<any> => {
  return await loginUser(accessToken);
};
