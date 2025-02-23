import { useGameControls } from "../../store/controls";
import { CharacterState } from "./character";

export const getMovementFromControl = (
  prevChar: CharacterState,
  delta: number
) => {
  const { keys, joystickInput } = useGameControls.getState();

  let { direction } = prevChar;

  let moveX = joystickInput.dx * prevChar.speed * delta;
  let moveY = joystickInput.dy * prevChar.speed * delta;

  if (keys["ArrowUp"]) moveY = -prevChar.speed * delta;
  if (keys["ArrowDown"]) moveY = prevChar.speed * delta;
  if (keys["ArrowLeft"]) {
    moveX = -prevChar.speed * delta;
    direction = -1;
  }
  if (keys["ArrowRight"]) {
    moveX = prevChar.speed * delta;
    direction = 1;
  }
  if (moveX < 0) direction = -1;
  if (moveX > 0) direction = 1;

  return {
    moveX,
    moveY,
    direction,
  };
};
