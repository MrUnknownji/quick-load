import React from "react";
import { StatusBar } from "expo-status-bar";
import usePathChangeListener from "@/hooks/usePathChangeListener";

const StatusBarManager = () => {
  const { activePath } = usePathChangeListener();

  const getStatusBarStyle = () => {
    const route = activePath.includes("user") ? "user" : activePath;
    switch (route) {
      case "profile":
      case "my-information":
      case "union-support":
      case "language":
      case "vehicles":
      case "user":
      case "add-vehicles":
        return "light";
      default:
        return "dark";
    }
  };

  return <StatusBar style={getStatusBarStyle()} />;
};

export default StatusBarManager;
