import React, { createContext, useContext, useState, ReactNode } from "react";

type ForceUpdateContextType = () => void;

const ForceUpdateContext = createContext<ForceUpdateContextType | undefined>(
  undefined
);

interface ForceUpdateProviderProps {
  children: ReactNode;
}

export const ForceUpdateProvider: React.FC<ForceUpdateProviderProps> = ({
  children,
}) => {
  const [updateKey, setUpdateKey] = useState<number>(0);

  const forceUpdate = (): void => setUpdateKey((prev) => prev + 1);

  return (
    <ForceUpdateContext.Provider value={forceUpdate}>
      <React.Fragment key={updateKey}>{children}</React.Fragment>
    </ForceUpdateContext.Provider>
  );
};

export const useForceUpdate = (): ForceUpdateContextType => {
  const context = useContext(ForceUpdateContext);
  if (context === undefined) {
    throw new Error("useForceUpdate must be used within a ForceUpdateProvider");
  }
  return context;
};
