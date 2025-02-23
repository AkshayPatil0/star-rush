import { create } from "zustand";
import {
  CHARACTER_SPEED,
  STAR_HEIGHT,
  STAR_WIDTH,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../lib/constants/game";
import { randomPosition } from "../lib/utils";
import { isCollidingWithObstacle } from "../lib/services/map";
import { Entity } from "../lib/services/entity";
import { CharacterState } from "../lib/services/character";

export type StarState = Entity;
export interface GameState {
  character: CharacterState;
  stars: StarState[];
  enemies: CharacterState[];
}

export const getNewStarState = (): StarState => {
  const star: StarState = {
    ...randomPosition(),
    height: STAR_HEIGHT,
    width: STAR_WIDTH,
  };
  return isCollidingWithObstacle(star) ? getNewStarState() : star;
};

const initialCharacterState: CharacterState = {
  id: 4,
  width: 40,
  height: 80,
  x: WORLD_WIDTH / 2,
  y: WORLD_HEIGHT / 2,
  direction: 1,
  isMoving: false,
  isShooting: false,
  fireRate: 5,
  ammo: Infinity,
  autoFireMode: true,
  gunRotation: 0,
  health: 100,
  speed: CHARACTER_SPEED,
  projectiles: [],
  stars: 0,
  kills: 0,
};

const initialState: GameState = {
  character: initialCharacterState,
  stars: [],
  enemies: [],
};

export const useGameState = create<GameState>(() => ({
  ...initialState,
}));

export const updateGameState = useGameState.setState;

export const resetGameState = () => updateGameState(initialState);
