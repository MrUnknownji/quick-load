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
      case "user":
        return "light";
      default:
        return "dark";
    }
  };

  return <StatusBar style={getStatusBarStyle()} />;
};

export default StatusBarManager;
