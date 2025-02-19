import { create } from "zustand";
import { STAR_COUNT } from "../lib/constants/game";
import { randomPosition } from "../lib/utils/game";
import { isCollidingWithObstacle } from "../lib/services/map";
import { CharacterState } from "./character";
import { CharacterId } from "../lib/services/character";

export interface StarState {
  x: number;
  y: number;
}
export interface ObstacleState {
  x: number;
  y: number;
}

export interface ProjectileState {
  x: number;
  y: number;
  angle: number;
}

export interface GameState {
  score: number;
  stars: StarState[];
  projectiles: ProjectileState[];
  enemies: CharacterState[];
}

const getStarPosition = (): { x: number; y: number } => {
  const { x, y } = randomPosition();
  return isCollidingWithObstacle(x, y, 10) ? getStarPosition() : { x, y };
};

const initialState: GameState = {
  stars: Array.from({ length: STAR_COUNT }, getStarPosition),
  score: 0,
  projectiles: [],
  enemies: Array.from({ length: 10 }).map<CharacterState>((_, i) => ({
    id: ((i % 4) + 1) as CharacterId,
    ...randomPosition(),
    direction: 1,
    isMoving: false,
    isShooting: false,
    fireRate: 5,
    ammo: 100,
    autoFireMode: true,
    gunRotation: 0,
    health: 100,
    speed: 3,
    isDead: false,
  })),
};

export const useGameState = create<GameState>(() => ({
  ...initialState,
}));

export const updateGameState = useGameState.setState;
