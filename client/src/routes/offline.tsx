import { AppProvider } from "@pixi/react";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

import { Application } from "pixi.js";
import OfflineGame from "../components/OfflineGame";

export default function GameContainer() {
  const app = useMemo(() => new Application(), []);

  return (
    <AppProvider value={app}>
      <OfflineGame />
    </AppProvider>
  );
}

export const Route = createFileRoute("/offline")({
  component: GameContainer,
});
