import { createFileRoute } from "@tanstack/react-router";
import { AppProvider } from "@pixi/react";
import { useMemo } from "react";

import { Application } from "pixi.js";
import OnlineGame from "../../components/OnlineGame";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";

const roomSearchSchema = z.object({
  roomId: z.string().optional(),
  stage: z.enum(["room", "character", "lobby", "play"]).default("room"),
});

export const Route = createFileRoute("/room/")({
  component: GameContainer,
  validateSearch: zodValidator(roomSearchSchema),
});

export default function GameContainer() {
  const app = useMemo(() => new Application(), []);

  return (
    <AppProvider value={app}>
      <OnlineGame />
    </AppProvider>
  );
}
