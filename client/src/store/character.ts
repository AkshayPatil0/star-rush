import { create } from "zustand";
import {
  CHARACTER_SPEED,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../lib/constants/game";
import { CharacterId } from "../lib/services/character";

export interface CharacterState {
  id: CharacterId;
  x: number;
  y: number;
  direction: number;
  isMoving: boolean;
  isShooting: boolean;
  fireRate: number;
  ammo: number;
  autoFireMode: boolean;
  gunRotation: number;
  health: number;
  speed: number;
  isDead: boolean;
}

const initialState: CharacterState = {
  id: 4,
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
  isDead: false,
};

export const useCharacter = create<CharacterState>(() => ({
  ...initialState,
}));

export const updateCharacter = useCharacter.setState;
