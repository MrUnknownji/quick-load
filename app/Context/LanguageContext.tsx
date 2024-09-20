import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "@/services/i18";
import { useForceUpdate } from "./ForceUpdateProvider";

const LANGUAGE_KEY = "appLanguage";

interface LanguageContextType {
  appLanguage: string | null;
  setAppLanguage: (language: string) => Promise<void>;
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [appLanguage, setAppLanguageState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
        const languageToUse = savedLanguage || "en";
        setAppLanguageState(languageToUse);
        i18n.changeLanguage(languageToUse);
      } catch (error) {
        console.error("Failed to load language from AsyncStorage", error);
      } finally {
        setLoading(false);
      }
    };

    loadLanguage();
  }, []);

  const setAppLanguage = async (language: string) => {
    try {
      if (language !== appLanguage) {
        await AsyncStorage.setItem(LANGUAGE_KEY, language);
        setAppLanguageState(language);
        i18n.changeLanguage(language);
      }
    } catch (error) {
      console.error("Failed to save language to AsyncStorage", error);
    }
    forceUpdate();
  };

  const value: LanguageContextType = {
    appLanguage,
    setAppLanguage,
    loading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageContext;
