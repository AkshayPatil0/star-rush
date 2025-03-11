import { Texture } from "pixi.js";
import backgroundImage from "../assets/environment/ground_white.png";
import backgroundImage2 from "../assets/environment/ground2_white.png";
import { Sprite } from "@pixi/react";
import { WORLD_HEIGHT, WORLD_WIDTH } from "../shared/constants/game";
import { Obstacle, ObstacleMap } from "../shared/services/map";
import obstacle1 from "../assets/environment/rock1.png";
import obstacle2 from "../assets/environment/rock2.png";
import obstacle3 from "../assets/environment/rock3.png";

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

const OBSTACLE_IMG_MAP: Record<number, string> = {
  1: obstacle1,
  2: obstacle2,
  3: obstacle3,
};

const ObstacleSprite: React.FC<{ obstacle: Obstacle }> = ({ obstacle }) => {
  return (
    <>
      <Sprite
        image={OBSTACLE_IMG_MAP[obstacle.type]}
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
