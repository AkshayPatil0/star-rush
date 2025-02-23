import { Sprite, Text } from "@pixi/react";
import Character from "./components/Character";
import Stars from "./components/Stars";
import CameraContainer from "./components/CameraContainer";
import Stats from "./components/Stats";
import Projectiles from "./components/Projectiles";
import Ground from "./components/Ground";
import cursorImg from "./assets/extras/crosshair.png";
import { useGameControls } from "./store/controls";

import { useGameState } from "./store/game";
import { Fragment } from "react/jsx-runtime";
import { usePreventScrollOnDrag } from "./hooks/usePreventScrollOnDrag";

const Game: React.FC<{ isStarted: boolean }> = ({ isStarted }) => {
  const { cursorInput } = useGameControls();
  const { character, enemies } = useGameState();

  usePreventScrollOnDrag();

  return (
    <>
      <CameraContainer>
        <Ground />
        {isStarted ? (
          <>
            <Character character={character} />
            {enemies.map((enemy, i) => (
              <Fragment key={i}>
                <Character character={enemy} />
                {!(enemy.health <= 0) && (
                  <Text
                    text={enemy.health.toString()}
                    x={enemy.x - 20}
                    y={enemy.y - 80}
                  />
                )}
              </Fragment>
            ))}
            <Stars />
            <Projectiles />
            <Sprite
              image={cursorImg}
              x={cursorInput.x}
              y={cursorInput.y}
              anchor={0.5}
              scale={0.5}
            />
          </>
        ) : null}
      </CameraContainer>
      {isStarted ? <Stats /> : null}
    </>
  );
};

export default Game;
