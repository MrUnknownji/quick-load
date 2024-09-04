import { useState, useEffect, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import useTabChangeListener from "./useTabChangeListener";

const useStackChangeListener = () => {
  const [activeRoute, setActiveRoute] = useState<string>("");
  const navigation = useNavigation();
  const { activeTab, setActiveTab } = useTabChangeListener();

  const handleStateChange = useCallback(() => {
    const state = navigation.getState();
    if (state) {
      if (state.routes.length > 0) {
        const currentRoute = state.routes[state.index] as RouteProp<
          ParamListBase,
          string
        >;
        if (currentRoute) setActiveRoute(currentRoute.name);
      }
    }
    setActiveTab(activeTab);
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", handleStateChange);

    handleStateChange();

    return () => {
      unsubscribe();
    };
  }, [navigation, handleStateChange]);

  return { activeRoute, setActiveRoute };
};

export default useStackChangeListener;
