import { PropsWithChildren, useEffect } from "react";
import { Container } from "@pixi/react";
import { updateGameControls, useGameControls } from "../store/controls";
import { WORLD_HEIGHT, WORLD_WIDTH } from "../shared/constants/game";
import { clamp } from "../shared/utils";
import { useGameState } from "../store/game";
import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from "../lib/constants/game";

const CameraContainer: React.FC<PropsWithChildren> = ({ children }) => {
  const { camera } = useGameControls();
  const { character } = useGameState();

  useEffect(() => {
    if (!character) return;
    updateGameControls({
      camera: {
        x: clamp(
          0,
          WORLD_WIDTH - VIEWPORT_WIDTH
        )(character.x - VIEWPORT_WIDTH / 2),
        y: clamp(
          0,
          WORLD_HEIGHT - VIEWPORT_HEIGHT
        )(character.y - VIEWPORT_HEIGHT / 2),
      },
    });
  }, [character]);

  return (
    <Container x={-camera.x} y={-camera.y}>
      {children}
    </Container>
  );
};

export default CameraContainer;
