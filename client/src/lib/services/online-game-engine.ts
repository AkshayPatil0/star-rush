import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../shared/dtos/events";
import { getRoomId } from "./room";
import { updateGameState, useGameState } from "../../store/game";
import { CharacterState } from "../../shared/dtos/character";
import { CHARACTER_SPEED } from "../../shared/constants/game";
import { characterShoot, moveOwnCharacter } from "./character";
import {
  CHARACTER_TYPE_PERSIST_KEY,
  USERNAME_PERSIST_KEY,
} from "../constants/constants";
import { ClientGameState, ServerGameState } from "../../shared/dtos/game-state";
import { getLocalState } from "../../hooks/useLocalStorageState";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  import.meta.env.VITE_WS_API || "",
  {
    query: {
      roomId: getRoomId(),
    },
  }
);

socket.on("connect", () => {
  console.log("connected");
});

socket.on("game_started", () => {
  console.log("Game started");
});

socket.on("game_update", (state) => {
  console.log("game_update", state);
  if (!socket.id) throw new Error("Socket not connected !");
  updateGameState(mapServerStateToGameState(state, socket.id));
});

socket.on("player_joined", (player) => {
  if (player.id === socket.id) return;
  console.log("player joined", player);
  updateGameState(({ enemies }) => {
    return {
      enemies: [...enemies, player],
    };
  });
});

socket.on("disconnect", () => {
  socket.removeAllListeners();
});

export const joinRoom = (roomId: string, player: CharacterState) => {
  if (!roomId) return;
  if (!socket.id) throw new Error("Socket not connected !");
  const playerWithId = {
    ...player,
    id: socket.id,
  };
  socket.emit("join_room", roomId, playerWithId);
  return playerWithId;
};

export const getInitialCharacterState = (): CharacterState => {
  return {
    id: "1",
    name: getLocalState(USERNAME_PERSIST_KEY, sessionStorage),
    type: getLocalState(CHARACTER_TYPE_PERSIST_KEY, sessionStorage),
    width: 40,
    height: 80,
    x: 0,
    y: 0,
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
};

export const gameLoop = (delta: number) => {
  const character = useGameState.getState().character;
  const roomId = getRoomId();
  if (!character || !roomId) return;
  const newCharacter = {
    ...character,
    ...moveOwnCharacter(character, delta),
    ...characterShoot(character, delta),
  };
  updateGameState(() => ({ character: newCharacter }));
  if (JSON.stringify(character) !== JSON.stringify(newCharacter))
    socket.emit("player_update", newCharacter, roomId);
};

export const getInitialGameState = (): ClientGameState => {
  return {
    character: getInitialCharacterState(),
    enemies: [],
    stars: [],
  };
};

export const mapServerStateToGameState = (
  serverState: ServerGameState,
  playerId: string
): ClientGameState => {
  const character = serverState.players[playerId];
  delete serverState.players[playerId];

  return {
    character,
    stars: serverState.stars,
    enemies: Object.values(serverState.players),
  };
};
