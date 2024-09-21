import {
  deleteUser,
  getUserInfo,
  editUserProfile,
  registerUser,
  loginUser,
  logoutUser,
  refreshToken as refreshTokenApi,
  sendOTP,
  verifyOTP,
} from "../api/userApi";
import { User, UserRegistration, UserLogin, UserEdit } from "../types/User";

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

export const registerNewUser = async (
  userData: UserRegistration,
): Promise<any> => {
  return await registerUser(userData);
};

export const loginUserAccount = async (
  credentials: UserLogin,
): Promise<any> => {
  return await loginUser(credentials);
};

export const logoutUserAccount = async (token: string): Promise<void> => {
  await logoutUser(token);
};

export const refreshUserToken = async (refreshToken: string): Promise<any> => {
  return await refreshTokenApi(refreshToken);
};

export const sendUserOTP = async (phone: string): Promise<any> => {
  return await sendOTP(phone);
};

export const verifyUserOTP = async (
  phone: string,
  otp: string,
): Promise<any> => {
  return await verifyOTP(phone, otp);
};
