import { useState, useCallback } from "react";
import {
  deleteUserAccount,
  getCurrentUser,
  updateUserProfile,
  loginUserAccount,
  logoutUserAccount,
  refreshUserToken,
} from "../services/userService";
import { User, UserEdit } from "../types/User";

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

  const login = useCallback(async (accessToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const loggedInUser = await loginUserAccount(accessToken);
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

  return {
    user,
    loading,
    error,
    deleteAccount,
    getUser,
    updateProfile,
    login,
    logout,
    refreshToken,
  };
};
