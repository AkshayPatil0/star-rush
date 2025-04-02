import { CharacterState } from "./character";
import { Entity } from "./common";

export type StarState = Entity;

export interface ClientGameState {
  character: CharacterState | null;
  stars: StarState[];
  enemies: CharacterState[];
  started: boolean;
}

export interface ServerGameState {
  stars: StarState[];
  players: Record<string, CharacterState>;
  started: boolean;
}
