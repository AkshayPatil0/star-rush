import { createContext, useContext } from "react";
import { getLocalState } from "../../hooks/useLocalStorageState";
import { USERNAME_PERSIST_KEY } from "../../lib/constants/constants";

type StageType = "room" | "character" | "lobby" | "play";
interface StageContextType {
  stage: StageType | undefined;
  setStage: React.Dispatch<React.SetStateAction<StageType | undefined>>;
}

export const getInitialStage = (): StageContextType["stage"] => {
  const params = new URLSearchParams(window.location.search);
  const roomId = params.get("roomId");

  if (!roomId) return "room";
  return "character";
};

export const stageContext = createContext<StageContextType | null>(null);

export const useStage = () => {
  const context = useContext(stageContext);
  if (!context) {
    throw new Error("useStage must be used within a StageProvider");
  }
  return context;
};
