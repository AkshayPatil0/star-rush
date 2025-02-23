import { Sprite } from "@pixi/react";
import projectileImage from "../assets/extras/bullet.png";
import { useGameState } from "../store/game";
import { useMemo } from "react";

const Projectiles = () => {
  const { character, enemies } = useGameState();

  const projectiles = useMemo(() => {
    return enemies.flatMap((e) => e.projectiles).concat(character.projectiles);
  }, [enemies, character]);
  return (
    <>
      {projectiles.map((p, index) => (
        <Sprite
          key={index}
          image={projectileImage}
          x={p.x}
          y={p.y}
          anchor={0.5}
          scale={0.4}
        />
      ))}
    </>
  );
};

export default Projectiles;
