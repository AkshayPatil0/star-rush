import { useState } from "react";
import { stageContext, getInitialStage } from "./stage-context";

export const StageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stage, setStage] = useState(getInitialStage);
  const value = { stage, setStage };

  return (
    <stageContext.Provider value={value}>{children}</stageContext.Provider>
  );
};
