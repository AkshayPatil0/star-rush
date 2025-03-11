import { CharacterState } from "./character";
import { ServerGameState } from "./game-state";

export interface ServerToClientEvents {
  game_update: (state: ServerGameState) => void;
  game_started: () => void;
  player_joined: (state: CharacterState) => void;
}

export interface ClientToServerEvents {
  join_room: (roomId: string, player: CharacterState) => void;
  start_game: (roomId: string) => void;
  exit_game: () => void;
  player_update: (state: CharacterState, roomId: string) => void;
}
