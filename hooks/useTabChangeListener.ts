import { useState, useEffect, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";

const useTabChangeListener = () => {
  const [activeTab, setActiveTab] = useState<string>("index");
  const navigation = useNavigation();

  const handleTabPress = useCallback(
    (e: { data: { state: { routes: { name: string }[]; index: number } } }) => {
      const { state } = e.data;
      const tabName = state.routes[state.index].name;

      if (tabName !== "(tabs)") {
        setActiveTab(tabName);
      }
    },
    []
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", handleTabPress);

    return () => {
      unsubscribe();
    };
  }, [navigation, handleTabPress]);

  return { activeTab, setActiveTab };
};

export default useTabChangeListener;
