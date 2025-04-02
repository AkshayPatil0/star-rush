import { createFileRoute } from "@tanstack/react-router";
import { AppProvider } from "@pixi/react";
import { useMemo } from "react";

import { Application } from "pixi.js";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import OnlineGameContainer from "../../components/online-game";

const roomSearchSchema = z.object({
  roomId: z.string().optional(),
});

export const Route = createFileRoute("/room/")({
  component: GameContainer,
  validateSearch: zodValidator(roomSearchSchema),
});

export default function GameContainer() {
  const app = useMemo(() => new Application(), []);

  return (
    <AppProvider value={app}>
      <OnlineGameContainer />
    </AppProvider>
  );
}
