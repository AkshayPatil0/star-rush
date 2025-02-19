import { WORLD_HEIGHT, WORLD_WIDTH } from "../constants/game";

export const randomPosition = () => ({
  x: Math.random() * (WORLD_WIDTH - 50),
  y: Math.random() * (WORLD_HEIGHT - 50),
});

export const isColliding = (
  obj1: { x: number; y: number; size: number },
  obj2: { x: number; y: number; size: number }
) => {
  return (
    obj1.x + obj1.size / 2 > obj2.x - obj2.size / 2 && // Character right edge > Obstacle left edge
    obj1.x - obj1.size / 2 < obj2.x + obj2.size / 2 && // Character left edge < Obstacle right edge
    obj1.y + obj1.size / 2 > obj2.y - obj2.size / 2 && // Character bottom edge > Obstacle top edge
    obj1.y - obj2.size / 2 < obj2.y + obj2.size / 2 // Character top edge < Obstacle bottom edge
  );
};
