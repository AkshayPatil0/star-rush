import { Texture } from "pixi.js";
import backgroundImage from "../assets/environment/ground_white.png";
import backgroundImage2 from "../assets/environment/ground2_white.png";
import { Sprite } from "@pixi/react";
import { WORLD_HEIGHT, WORLD_WIDTH } from "../lib/constants/game";
import { Obstacle, ObstacleMap } from "../lib/services/map";

const backgroundTexture = Texture.from(backgroundImage); // Large background image
const backgroundTexture2 = Texture.from(backgroundImage2); // Large background image

const Ground: React.FC = () => {
  return (
    <>
      <Sprite
        texture={backgroundTexture}
        x={0}
        y={0}
        width={WORLD_WIDTH}
        height={WORLD_HEIGHT}
        // tint={0x48525c}
        tint={0xfad5a5}
      />
      <Sprite
        texture={backgroundTexture2}
        x={WORLD_WIDTH / 2}
        y={WORLD_HEIGHT / 2}
        anchor={0.5}
        // tint={0x48525c}
        tint={0xfad5a5}
      />
      {ObstacleMap.map((obstacle, index) => (
        <ObstacleSprite obstacle={obstacle} key={index} />
      ))}
    </>
  );
};

const ObstacleSprite: React.FC<{ obstacle: Obstacle }> = ({ obstacle }) => {
  return (
    <>
      <Sprite
        image={obstacle.image}
        x={obstacle.x}
        y={obstacle.y}
        anchor={0.5}
        // tint={0x5a6673}
        tint={0xfad5a5}
      />
    </>
  );
};

export default Ground;
