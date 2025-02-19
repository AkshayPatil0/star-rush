import { create } from "zustand";

export interface JoystickState {
  dx: number;
  dy: number;
}
export interface CursorState {
  x: number;
  y: number;
}

export interface CameraState {
  x: number;
  y: number;
}
export interface ControlState {
  keys: Record<string, boolean>;
  joystickInput: JoystickState;
  cursorInput: CursorState;
  camera: CameraState;
}

const initialState: ControlState = {
  keys: {},
  joystickInput: { dx: 0, dy: 0 },
  cursorInput: { x: 0, y: 0 },
  camera: { x: 0, y: 0 },
};

export const useGameControls = create<ControlState>(() => ({
  ...initialState,
}));

export const updateGameControls = useGameControls.setState;
