import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import StatusBarManager from "@/components/StatusBarManager";
import { I18nextProvider } from "react-i18next";
import i18n from "@/services/i18";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ForceUpdateProvider } from "@/contexts/ForceUpdateProvider";
import { ThemeProvider } from "@/contexts/AppThemeProvider";
import NavigationBarManager from "@/components/NavigationBarManager";
import { UserProvider } from "@/contexts/userContext";
import CustomSplashScreen from "@/components/CustomSplashScreen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [isReady, setIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const prepare = async () => {
      try {
        if (loaded) {
          await SplashScreen.hideAsync();
          setIsReady(true);
        }
      } catch (e) {
        console.error("Error during app initialization:", e);
      }
    };

    prepare();
  }, [loaded]);

  if (!isReady || !loaded) {
    return null;
  }

  if (showSplash) {
    return <CustomSplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <ThemeProvider>
      <ForceUpdateProvider>
        <LanguageProvider>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <StatusBarManager />
              <NavigationBarManager />
              <GestureHandlerRootView style={{ flex: 1 }}>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    animation: "fade_from_bottom",
                  }}
                >
                  <Stack.Screen
                    name="thank-you/index"
                    options={{ title: "Thank You" }}
                  />
                  <Stack.Screen
                    name="find-route/index"
                    options={{ title: "Find Route" }}
                  />
                  <Stack.Screen
                    name="onboarding/index"
                    options={{ title: "Onboarding" }}
                  />
                  <Stack.Screen
                    name="product-items/index"
                    options={{ title: "Product Items" }}
                  />
                  <Stack.Screen
                    name="authentication/index"
                    options={{ title: "Authentication" }}
                  />
                  <Stack.Screen
                    name="order-detail/order-track/index"
                    options={{ title: "Order Detail" }}
                  />
                  <Stack.Screen
                    name="product-detail/[productId]"
                    options={{ title: "Product Detail" }}
                  />
                </Stack>
              </GestureHandlerRootView>
            </I18nextProvider>
          </UserProvider>
        </LanguageProvider>
      </ForceUpdateProvider>
    </ThemeProvider>
  );
}
