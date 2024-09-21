import React from "react";
import { StatusBar } from "expo-status-bar";
import usePathChangeListener from "@/hooks/usePathChangeListener";
import { useTheme } from "@/contexts/AppThemeProvider";

const StatusBarManager = () => {
  const { activePath } = usePathChangeListener();

  const getStatusBarStyle = () => {
    const route = activePath.includes("user") ? "user" : activePath;

    const { appTheme } = useTheme();

    if (appTheme === "dark") {
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
        case "privacy-and-policy":
        case "admin":
        case "add-product":
        case "add-brand":
        case "add-category":
        case "remove-product-brand":
        case "manage-accounts":
        case "edit-page":
          return "light";
        default:
          return "dark";
      }
    }
  };

  return <StatusBar style={getStatusBarStyle()} />;
};

export default StatusBarManager;
