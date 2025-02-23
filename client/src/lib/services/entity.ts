export interface Entity {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const isColliding = (obj1: Entity, obj2: Entity) => {
  const hr = obj1.width / 2 + obj2.width / 2;
  const vr = obj1.height / 2 + obj2.height / 2;
  // Apply ellipse equation
  const normalizedValue =
    (obj1.x - obj2.x) ** 2 / hr ** 2 + (obj1.y - obj2.y) ** 2 / vr ** 2;

  // If <= 1, collision detected
  return normalizedValue <= 1;
};

// export const isCollidingSquare = (obj1: Entity, obj2: Entity) => {
//   return (
//     obj1.x + obj1.size / 2 > obj2.x - obj2.size / 2 && // Character right edge > Obstacle left edge
//     obj1.x - obj1.size / 2 < obj2.x + obj2.size / 2 && // Character left edge < Obstacle right edge
//     obj1.y + obj1.size / 2 > obj2.y - obj2.size / 2 && // Character bottom edge > Obstacle top edge
//     obj1.y - obj2.size / 2 < obj2.y + obj2.size / 2 // Character top edge < Obstacle bottom edge
//   );
// };
