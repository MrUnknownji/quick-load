import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LANGUAGE_KEY = "appLanguage";

const useAppLanguage = () => {
  const [appLanguage, setAppLanguage] = useState<string | null>(null);

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage) {
        setAppLanguage(savedLanguage);
      } else {
        setAppLanguage("English");
      }
    };

    loadLanguage();
  }, []);

  const saveLanguage = async (language: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, language);
      setAppLanguage(language);
    } catch (error) {
      console.error("Failed to save language to AsyncStorage", error);
    }
  };

  return { appLanguage, setAppLanguage: saveLanguage };
};

export default useAppLanguage;
