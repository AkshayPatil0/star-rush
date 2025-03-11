import { create } from "zustand";
import { ClientGameState } from "../shared/dtos/game-state";

const initialState: ClientGameState = {
  character: null,
  stars: [],
  enemies: [],
};

export const useGameState = create<ClientGameState>(() => ({
  ...initialState,
}));

export const updateGameState = useGameState.setState;

export const resetGameState = () => updateGameState(initialState);
