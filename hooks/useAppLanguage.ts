import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "@/services/i18";

const LANGUAGE_KEY = "appLanguage";

const useAppLanguage = () => {
  const [appLanguage, setAppLanguage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
        const languageToUse = savedLanguage || "en";
        setAppLanguage(languageToUse);
        i18n.changeLanguage(languageToUse);
      } catch (error) {
        console.error("Failed to load language from AsyncStorage", error);
      } finally {
        setLoading(false);
      }
    };

    loadLanguage();
  }, []);

  const saveLanguage = async (language: string) => {
    try {
      if (language !== appLanguage) {
        await AsyncStorage.setItem(LANGUAGE_KEY, language);
        setAppLanguage(language);
        i18n.changeLanguage(language);
      }
    } catch (error) {
      console.error("Failed to save language to AsyncStorage", error);
    }
  };

  return { appLanguage, setAppLanguage: saveLanguage, loading };
};

export default useAppLanguage;
