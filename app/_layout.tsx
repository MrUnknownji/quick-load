import { useFonts } from "expo-font";
import { Slot, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import StatusBarManager from "@/components/StatusBarManager";
import { I18nextProvider } from "react-i18next";
import i18n from "@/services/i18";
import { LanguageProvider } from "./Context/LanguageContext";
import { ForceUpdateProvider } from "./Context/ForceUpdateProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider } from "./Context/AppThemeProvider";
import NavigationBarManager from "@/components/NavigationBarManager";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const prepare = async () => {
      try {
        if (loaded) {
          await SplashScreen.hideAsync();
          const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");
          setIsReady(true);

          setTimeout(() => {
            if (hasOnboarded === null) {
              router.replace("/onboarding");
            } else {
              router.replace("/authentication");
            }
          }, 0);
        }
      } catch (e) {
        console.error("Error during app initialization:", e);
      }
    };

    prepare();
  }, [loaded, router]);

  if (!isReady || !loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <ForceUpdateProvider>
        <LanguageProvider>
          <I18nextProvider i18n={i18n}>
            <StatusBarManager />
            <NavigationBarManager />
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Slot
                screenOptions={{
                  headerShown: false,
                  animation: "fade_from_bottom",
                  animationDuration: 100,
                }}
              />
            </GestureHandlerRootView>
          </I18nextProvider>
        </LanguageProvider>
      </ForceUpdateProvider>
    </ThemeProvider>
  );
}
