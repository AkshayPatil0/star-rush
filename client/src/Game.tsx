import { Sprite, Text, useTick } from "@pixi/react";
import Character from "./components/Character";
import Stars from "./components/Stars";
import CameraContainer from "./components/CameraContainer";
import Score from "./components/Score";
import { gameLoop } from "./lib/game-engine";
import Projectiles from "./components/Projectiles";
import Ground from "./components/Ground";
import cursorImg from "./assets/extras/crosshair.png";
import { useGameControls } from "./store/controls";
import { useCharacter } from "./store/character";

import { useGameState } from "./store/game";
import { Fragment } from "react/jsx-runtime";

const Game = () => {
  const { cursorInput } = useGameControls();
  const character = useCharacter();
  const { enemies } = useGameState();

  useTick((delta) => {
    gameLoop(Math.min(delta, 5));
  });

  return (
    <>
      <CameraContainer>
        <Ground />
        <Character character={character} />
        {enemies.map((enemy, i) => (
          <Fragment key={i}>
            <Character character={enemy} />
            {!enemy.isDead && (
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
      </CameraContainer>
      <Score />
    </>
  );
};

export default Game;
