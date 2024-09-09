import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_KEY = "appTheme";

interface ThemeContextType {
  appTheme: string;
  setAppTheme: (theme: string) => Promise<void>;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [appTheme, setAppThemeState] = useState<string>("light");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        const themeToUse = savedTheme || "light";
        setAppThemeState(themeToUse);
      } catch (error) {
        console.error("Failed to load theme from AsyncStorage", error);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, []);

  const setAppTheme = async (theme: string) => {
    try {
      if (theme !== appTheme) {
        await AsyncStorage.setItem(THEME_KEY, theme);
        setAppThemeState(theme);
      }
    } catch (error) {
      console.error("Failed to save theme to AsyncStorage", error);
    }
  };

  const value: ThemeContextType = {
    appTheme,
    setAppTheme,
    loading,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeContext;
