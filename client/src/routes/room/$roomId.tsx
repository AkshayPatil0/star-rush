import { Stage } from "@pixi/react";
import Game from "../../Game";
import { usePreventScrollOnDrag } from "../../hooks/usePreventScrollOnDrag";
import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from "../../lib/constants/game";
import GameControls from "../../components/GameControls";
import { createFileRoute } from "@tanstack/react-router";

export default function GameContainer() {
  usePreventScrollOnDrag();

  return (
    <div>
      <Stage width={VIEWPORT_WIDTH} height={VIEWPORT_HEIGHT}>
        <Game isStarted />
      </Stage>
      <GameControls />
    </div>
  );
}

export const Route = createFileRoute("/room/$roomId")({
  component: GameContainer,
});
