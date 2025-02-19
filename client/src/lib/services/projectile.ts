import { useGameState } from "../../store/game";

export type ProjectileType = "bullet";

export const isCollidingWithProjectile = ({
  x,
  y,
  size,
}: {
  x: number;
  y: number;
  size: number;
}) => {
  const { projectiles } = useGameState.getState();

  return projectiles.some(
    (projectile) =>
      x + size / 2 > projectile.x - 5 && // Character right edge > Obstacle left edge
      x < projectile.x + 5 && // Character left edge < Obstacle right edge
      y + size / 2 > projectile.y - 5 && // Character bottom edge > Obstacle top edge
      y < projectile.y + 5 // Character top edge < Obstacle bottom edge
  );
};
