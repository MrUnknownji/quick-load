import React from "react";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { useTheme } from "@/contexts/AppThemeProvider";
import { usePathname } from "expo-router";

const StatusBarManager = () => {
  const { appTheme } = useTheme();
  const systemColorScheme = useColorScheme();
  const route = usePathname();

  const getStatusBarStyle = () => {
    if (route.includes("profile")) {
      return "light";
    }

    if (appTheme === "system") {
      return systemColorScheme === "dark" ? "light" : "dark";
    }

    return appTheme === "dark" ? "light" : "dark";
  };

  return <StatusBar style={getStatusBarStyle()} />;
};

export default StatusBarManager;
