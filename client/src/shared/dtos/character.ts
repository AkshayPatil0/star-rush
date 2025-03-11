import { Entity } from "./common";

export type CharacterType = 1 | 2 | 3 | 4;

export interface GunState {
  fireRate: number;
  ammo: number;
  autoFireMode: boolean;
  gunRotation: number;
}

export interface ProjectileState extends Entity {
  angle: number;
}

export interface CharacterState extends Entity, GunState {
  id: string;
  name: string;
  type: CharacterType;
  direction: number;
  speed: number;
  isMoving: boolean;
  health: number;
  isShooting: boolean;
  projectiles: ProjectileState[];
  stars: number;
  kills: number;
}
