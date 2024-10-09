import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types/User";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  initializeContextUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const initializeContextUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error initializing user context:", error);
    }
  };

  useEffect(() => {
    initializeContextUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, initializeContextUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useContextUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useContextUser must be used within a UserProvider");
  }
  return context;
};
