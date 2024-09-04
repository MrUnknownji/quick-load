import { useEffect, useState } from "react";
import { usePathname } from "expo-router";

const useTabChangeListener = () => {
  const [activeTab, setActiveTab] = useState<string>("index");
  const pathname = usePathname();

  useEffect(() => {
    const tabName = pathname.split("/").pop() || "index";
    setActiveTab(tabName);
  }, [pathname]);

  return { activeTab, setActiveTab };
};

export default useTabChangeListener;
