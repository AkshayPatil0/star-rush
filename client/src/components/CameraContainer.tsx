import { PropsWithChildren, useEffect } from "react";
import { Container } from "@pixi/react";
import { updateGameControls, useGameControls } from "../store/controls";
import { useCharacter } from "../store/character";
import {
  VIEWPORT_HEIGHT,
  VIEWPORT_WIDTH,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../lib/constants/game";
import { clamp } from "../lib/utils/math";

const CameraContainer: React.FC<PropsWithChildren> = ({ children }) => {
  const { camera } = useGameControls();
  const character = useCharacter();

  useEffect(() => {
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
