import { useEffect, useState } from "react";
import { usePathname } from "expo-router";

const usePathChangeListener = () => {
  const [activePath, setActivePath] = useState<string>("index");
  const pathname = usePathname();

  useEffect(() => {
    const pathName = pathname.split("/").pop() || "index";
    setActivePath(pathName);
  }, [pathname]);

  return { activePath, setActivePath };
};

export default usePathChangeListener;
