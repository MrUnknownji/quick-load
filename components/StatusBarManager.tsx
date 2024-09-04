import React from "react";
import { StatusBar } from "expo-status-bar";
import { usePathname } from "expo-router";

const StatusBarManager = () => {
  const pathname = usePathname();

  const getStatusBarStyle = () => {
    const currentRoute = pathname.split("/").pop() || "index";
    const route = currentRoute.includes("user") ? "user" : currentRoute;
    switch (route) {
      case "profile":
      case "my-information":
      case "user":
        return "light";
      default:
        return "dark";
    }
  };

  return <StatusBar style={getStatusBarStyle()} />;
};

export default StatusBarManager;
