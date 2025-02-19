import { Sprite } from "@pixi/react";
import starImage from "../assets/icons/Icon_Star.png";
import { useGameState } from "../store/game";

const Stars = () => {
  const { stars } = useGameState();
  return stars.map((star, index) => (
    <Sprite
      key={index}
      image={starImage}
      x={star.x}
      y={star.y}
      anchor={0.5}
      scale={0.1}
    />
  ));
};

export default Stars;
