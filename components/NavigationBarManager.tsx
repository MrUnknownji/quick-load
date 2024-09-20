import React, { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import usePathChangeListener from "@/hooks/usePathChangeListener";
import { useTheme } from "@/app/Context/AppThemeProvider";
import { Platform } from "react-native";
import Colors from "@/constants/Colors";

const NavigationBarManager = () => {
  const { activePath } = usePathChangeListener();
  const { appTheme } = useTheme();

  const getNavigationBarColor = () => {
    const route = activePath.includes("user") ? "user" : activePath;

    if (appTheme === "dark") {
      switch (route) {
        case "index":
        case "track-order":
        case "contact-us":
        case "profile":
          return Colors.dark.background;
        default:
          return "transparent";
      }
    } else {
      switch (route) {
        case "index":
        case "track-order":
        case "contact-us":
        case "profile":
          return Colors.light.primary;
        default:
          return "transparent";
      }
    }
  };

  useEffect(() => {
    if (Platform.OS === "android") {
      const setNavBarColor = async () => {
        const color = getNavigationBarColor();
        await NavigationBar.setBackgroundColorAsync(color);
        await NavigationBar.setButtonStyleAsync(
          appTheme === "dark" ? "light" : "dark",
        );
      };

      setNavBarColor();
    }
  }, [activePath, appTheme]);

  return null;
};

export default NavigationBarManager;
