import { createFileRoute } from "@tanstack/react-router";
import { AppProvider } from "@pixi/react";
import { useMemo } from "react";

import { Application } from "pixi.js";

export const Route = createFileRoute("/room/")({
  component: GameContainer,
});

export default function GameContainer() {
  const app = useMemo(() => new Application(), []);

  return <AppProvider value={app}></AppProvider>;
}
