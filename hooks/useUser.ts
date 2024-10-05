import { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  deleteUserAccount,
  getCurrentUser,
  updateUserProfile,
  loginUserAccount,
} from "../services/userService";
import { User } from "../types/User";

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const initializeUser = useCallback(async () => {
    setLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Error initializing user:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  const deleteAccount = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteUserAccount(userId);
      setUser(null);
      await AsyncStorage.removeItem("user");
    } catch (err) {
      setError("Failed to delete account");
    } finally {
      setLoading(false);
    }
  }, []);

  const getUser = useCallback(async (userId: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const userData = await getCurrentUser(userId);
      setUser(userData);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (err) {
      setError("Failed to fetch user info");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (userId: string, userData: FormData) => {
      setLoading(true);
      setError(null);
      try {
        const updatedUser = await updateUserProfile(userId, userData);
        setUser(updatedUser);
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        return true;
      } catch (err) {
        console.error("Error updating user profile:", err);
        setError("Failed to update profile");
        return false;
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
      await AsyncStorage.setItem("user", JSON.stringify(loggedInUser.user));
      await AsyncStorage.setItem("accessToken", loggedInUser.accessToken);
      await AsyncStorage.setItem("refreshToken", loggedInUser.refreshToken);
      return loggedInUser;
    } catch (err) {
      setError("Failed to login");
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
  };
};
