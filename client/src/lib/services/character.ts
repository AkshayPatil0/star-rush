import { CharacterState } from "../../shared/dtos/character";
import { boundEntityMovement } from "../../shared/services/map";
import { useGameControls } from "../../store/controls";
import { getAngle } from "../../shared/utils";
import { getMovementFromControl } from "./control";
import {
  getNewProjectileState,
  shooter,
} from "../../shared/services/projectile";
import { getProjectileAnchorByCharacter } from "../../shared/services/character";

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

export const getCharacterId = () => {
  return sessionStorage.getItem("characterId");
};

const characterShooter: ReturnType<typeof shooter> = shooter();

export const characterShoot = (prevChar: CharacterState, delta: number) => {
  const { keys } = useGameControls.getState();

  if (!keys[" "]) {
    characterShooter.reset();
    return { isShooting: false };
  }

  if (prevChar.ammo <= 0) return { isShooting: false };

  const shot = characterShooter.shoot(
    {
      fireRate: prevChar.fireRate,
      autoMode: prevChar.autoFireMode,
    },
    delta
  );
  if (shot) {
    const projectile = getNewProjectileState({
      anchor: getProjectileAnchorByCharacter(prevChar),
      angle: prevChar.gunRotation,
    });
    return {
      projectiles: [...prevChar.projectiles, projectile],
      ammo: prevChar.ammo - 1,
      isShooting: true,
    };
  }

  return { isShooting: false };
};
