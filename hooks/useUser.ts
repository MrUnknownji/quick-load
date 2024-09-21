import { useState, useCallback } from "react";
import {
  deleteUserAccount,
  getCurrentUser,
  updateUserProfile,
  registerNewUser,
  loginUserAccount,
  logoutUserAccount,
  refreshUserToken,
  sendUserOTP,
  verifyUserOTP,
} from "../services/userService";
import { User, UserRegistration, UserLogin, UserEdit } from "../types/User";

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAccount = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteUserAccount(token);
      setUser(null);
    } catch (err) {
      setError("Failed to delete account");
    } finally {
      setLoading(false);
    }
  }, []);

  const getUser = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await getCurrentUser(token);
      setUser(userData);
    } catch (err) {
      setError("Failed to fetch user info");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (token: string, userData: FormData) => {
      setLoading(true);
      setError(null);
      try {
        const updatedUser = await updateUserProfile(token, userData);
        setUser(updatedUser);
      } catch (err) {
        setError("Failed to update profile");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const register = useCallback(async (userData: UserRegistration) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await registerNewUser(userData);
      setUser(newUser.user);
      return newUser;
    } catch (err) {
      setError("Failed to register");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: UserLogin) => {
    setLoading(true);
    setError(null);
    try {
      const loggedInUser = await loginUserAccount(credentials);
      setUser(loggedInUser.user);
      return loggedInUser;
    } catch (err) {
      setError("Failed to login");
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      await logoutUserAccount(token);
      setUser(null);
    } catch (err) {
      setError("Failed to logout");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async (refreshToken: string) => {
    setLoading(true);
    setError(null);
    try {
      return await refreshUserToken(refreshToken);
    } catch (err) {
      setError("Failed to refresh token");
    } finally {
      setLoading(false);
    }
  }, []);

  const sendOTP = useCallback(async (phone: string) => {
    setLoading(true);
    setError(null);
    try {
      return await sendUserOTP(phone);
    } catch (err) {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOTP = useCallback(async (phone: string, otp: string) => {
    setLoading(true);
    setError(null);
    try {
      return await verifyUserOTP(phone, otp);
    } catch (err) {
      setError("Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    deleteAccount,
    getUser,
    updateProfile,
    register,
    login,
    logout,
    refreshToken,
    sendOTP,
    verifyOTP,
  };
};
