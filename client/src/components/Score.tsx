import { Text } from "@pixi/react";
import { TextStyle } from "pixi.js";
import { useGameState } from "../store/game";
import { useCharacter } from "../store/character";

const Score = () => {
  const { score } = useGameState();
  const { ammo, health } = useCharacter();
  return (
    <>
      <Text
        text={`Score: ${score}`}
        x={20}
        y={20}
        style={new TextStyle({ fill: "white", fontSize: 24 })}
      />
      <Text
        text={`Ammo: ${ammo}`}
        x={120}
        y={20}
        style={
          new TextStyle({
            fill: ammo <= 0 ? "red" : ammo <= 20 ? "yellow" : "green",
            fontSize: 24,
          })
        }
      />
      <Text
        text={`Health: ${health}`}
        x={260}
        y={20}
        style={
          new TextStyle({
            fill: health <= 0 ? "red" : health <= 20 ? "yellow" : "green",
            fontSize: 24,
          })
        }
      />
    </>
  );
};

export default Score;
