import { useGameControls } from "../../store/controls";
import { CharacterType } from "../constants/character";
import { getAngle } from "../utils/math";
import { WithOnlyRequired } from "../utils/type";
import { getMovementFromControl } from "./control";
import { Entity } from "./entity";
import { boundEntityMovement } from "./map";
import { ProjectileState } from "./projectile";
export interface GunState {
  fireRate: number;
  ammo: number;
  autoFireMode: boolean;
  gunRotation: number;
}

export interface CharacterState extends Entity, GunState {
  id: CharacterType;
  direction: number;
  speed: number;
  isMoving: boolean;
  health: number;
  isShooting: boolean;
  projectiles: ProjectileState[];
  stars: number;
  kills: number;
}

export const getGunPositionByCharacter = (
  character: WithOnlyRequired<CharacterState, "x" | "y" | "direction">
) => {
  const x = character.x + character.direction * 15;
  const y = character.y + 10;
  return { x, y };
};

export const getProjectileAnchorByCharacter = (
  character: WithOnlyRequired<
    CharacterState,
    "x" | "y" | "direction" | "gunRotation"
  >
) => {
  const gun = getGunPositionByCharacter(character);
  const x = gun.x + 60 * Math.cos(character.gunRotation);
  const y = gun.y + 60 * Math.sin(character.gunRotation);
  return { x, y };
};

export const moveOwnCharacter = (prevChar: CharacterState, delta: number) => {
  const { moveX, moveY, direction } = getMovementFromControl(prevChar, delta);
  const isMoving = moveX != 0 || moveY != 0;

  const { x, y } = boundEntityMovement({
    object: prevChar,
    moveX,
    moveY,
  });

  return {
    x,
    y,
    direction,
    isMoving,
    gunRotation: calculateGunRotation({ x, y }),
  };
};

const calculateGunRotation = (charPosition: { x: number; y: number }) => {
  const { cursorInput } = useGameControls.getState();
  return getAngle(charPosition, cursorInput);
};

export const getRandomCharacterType = () => {
  return Math.floor(Math.random() * 3 + 1) as CharacterType;
};
