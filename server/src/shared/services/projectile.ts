import {
  PROJECTILE_HEIGHT,
  PROJECTILE_SPEED,
  PROJECTILE_WIDTH,
} from "../constants/game";
import { ProjectileState } from "../dtos/character";
import { isCollidingWithObstacle } from "./map";

export type ProjectileType = "bullet";

export const shooter = () => {
  let shootDelay = 0;
  return {
    reset: () => {
      shootDelay = 0;
    },
    shoot: (
      {
        fireRate,
        autoMode,
      }: {
        fireRate: number;
        autoMode: boolean;
      },
      delta: number
    ) => {
      if (shootDelay <= 0) {
        shootDelay = autoMode ? 60 : Infinity;
        return true;
      } else {
        shootDelay -= fireRate * delta;
        return false;
      }
    },
  };
};

export const moveProjectile = (
  projectile: ProjectileState,
  delta: number
): ProjectileState => {
  const velocityX = Math.cos(projectile.angle) * PROJECTILE_SPEED * delta;
  const velocityY = Math.sin(projectile.angle) * PROJECTILE_SPEED * delta;

  return {
    ...projectile,
    x: projectile.x + velocityX,
    y: projectile.y + velocityY,
  };
};

export const moveProjectiles = (
  projectiles: ProjectileState[],
  delta: number
): ProjectileState[] => {
  return projectiles
    .map((p) => moveProjectile(p, delta))
    .filter((p) => !isCollidingWithObstacle(p));
};

export const getNewProjectileState = ({
  anchor,
  angle,
}: {
  anchor: { x: number; y: number };
  angle: number;
}): ProjectileState => {
  return {
    ...anchor,
    angle,
    height: PROJECTILE_HEIGHT,
    width: PROJECTILE_WIDTH,
  };
};
