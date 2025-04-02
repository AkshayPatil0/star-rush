import { CharacterState } from "../shared/dtos/character";
import { ServerGameState } from "../shared/dtos/game-state";
import { getInitialGameState, getNextGameState } from "./game-service";

const roomState = new Map<string, ServerGameState>();

export const getRoomState = (roomId: string) => {
  const state = roomState.get(roomId);
  if (!state) throw new Error(`Room state not available for room - ${roomId}`);
  return state;
};

export const getOrCreateRoom = (roomId: string) => {
  const state = roomState.get(roomId);
  if (state) return state;

  const newState = getInitialGameState();
  roomState.set(roomId, newState);
  return newState;
};

export const setRoomState = (
  roomId: string,
  state: Partial<ServerGameState>
) => {
  const currentState = getRoomState(roomId);
  roomState.set(
    roomId,
    currentState
      ? {
          ...currentState,
          ...state,
        }
      : {
          ...getInitialGameState(),
          ...state,
        }
  );
};

export const updateRoomState = (roomId: string) => {
  const state = getOrCreateRoom(roomId);
  const updatedState = getNextGameState(state);
  setRoomState(roomId, updatedState);
  return updatedState;
};

export const updatePlayer = (
  roomId: string,
  playerId: string,
  playerState: CharacterState
) => {
  const currentRoomState = getOrCreateRoom(roomId);
  setRoomState(roomId, {
    players: {
      ...currentRoomState.players,
      [playerId]: playerState,
    },
  });
};

export const removePlayer = (roomId: string, playerId: string) => {
  const currentRoomState = getOrCreateRoom(roomId);
  delete currentRoomState.players[playerId];
  setRoomState(roomId, {
    players: currentRoomState.players,
  });
};

export const getAllRooms = () => {
  return Array.from(roomState.entries());
};

export const startRoomGame = (roomId: string) => {
  setRoomState(roomId, {
    started: true,
  });
};
