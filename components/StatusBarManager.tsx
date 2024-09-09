import React from "react";
import { StatusBar } from "expo-status-bar";
import usePathChangeListener from "@/hooks/usePathChangeListener";
import { useTheme } from "@react-navigation/native";

const StatusBarManager = () => {
  const { activePath } = usePathChangeListener();

  const getStatusBarStyle = () => {
    const route = activePath.includes("user") ? "user" : activePath;

    const theme = useTheme();

    if (theme.dark) {
      switch (route) {
        case "vehicles":
        case "add-vehicles":
        case "route-map":
          return "dark";
        default:
          return "light";
      }
    } else {
      switch (route) {
        case "profile":
        case "my-information":
        case "union-support":
        case "vehicles":
        case "user":
        case "add-vehicles":
        case "settings":
          return "light";
        default:
          return "dark";
      }
    }
  };

  return <StatusBar style={getStatusBarStyle()} />;
};

export default StatusBarManager;
