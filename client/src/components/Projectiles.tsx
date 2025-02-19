import { Sprite } from "@pixi/react";
import projectileImage from "../assets/extras/bullet.png";
import { useGameState } from "../store/game";

const Projectiles = () => {
  const { projectiles } = useGameState();
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
