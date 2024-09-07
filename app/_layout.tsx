import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import StatusBarManager from "@/components/StatusBarManager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18nextProvider } from "react-i18next";
import i18n from "@/services/i18";
import useAppLanguage from "@/hooks/useAppLanguage";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const {} = useAppLanguage();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const hasOnboarded = null;
      // const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");
      if (loaded) {
        SplashScreen.hideAsync();
        if (hasOnboarded === null) {
          router.replace("/onboarding");
        } else {
          router.replace("/authentication");
        }
      }
      setIsLoading(false);
    };

    checkOnboardingStatus();
  }, [loaded]);

  if (isLoading || !loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <I18nextProvider i18n={i18n}>
        <StatusBarManager />
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack
            screenOptions={{ headerShown: false }}
            initialRouteName="onboarding/index"
          >
            <Stack.Screen name="onboarding/index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="authentication/index" />
            <Stack.Screen name="subscription/index" />
            <Stack.Screen name="product-detail/[productId]" />
            <Stack.Screen name="thank-you/index" />
            <Stack.Screen name="order-detail/order-track/index" />
            <Stack.Screen name="brand-items/index" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </GestureHandlerRootView>
      </I18nextProvider>
    </ThemeProvider>
  );
}
