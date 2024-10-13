import React from "react";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/contexts/AppThemeProvider";
import { usePathname } from "expo-router";

const StatusBarManager = () => {
  const getStatusBarStyle = () => {
    const route = usePathname();
    const { appTheme } = useTheme();

    if (route.includes("profile") || appTheme.includes("dark")) {
      return "light";
    } else {
      return "dark";
    }
  };

  return <StatusBar style={getStatusBarStyle()} />;
};

export default StatusBarManager;
