import {
  CharacterState,
  updateCharacter,
  useCharacter,
} from "../store/character";
import { useGameControls } from "../store/controls";
import { ProjectileState, updateGameState } from "../store/game";
import { PROJECTILE_SPEED, WORLD_WIDTH } from "./constants/game";
import {
  getGunCoordsByCharacter,
  updateCharacterHealth,
} from "./services/character";
import {
  boundCharacterMovement,
  isCollidingWithObstacle,
} from "./services/map";
import { isColliding, randomPosition } from "./utils/game";
import { getDistance } from "./utils/math";

const moveOwnCharacter = (delta: number) => {
  const { keys, joystickInput } = useGameControls.getState();
  updateCharacter((prevChar) => {
    const { x, y } = prevChar;
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

    const gunRotation = calculateGunRotation();

    return {
      ...boundCharacterMovement({ x, y, moveX, moveY }),
      direction,
      gunRotation,
    };
  });
};

const calculateGunRotation = () => {
  const { cursorInput } = useGameControls.getState();
  const character = useCharacter.getState();
  const mouseX = cursorInput.x;
  const mouseY = cursorInput.y;

  const dx = mouseX - character.x;
  const dy = mouseY - character.y;

  const angle = Math.atan2(dy, dx);

  return angle;
};

const moveProjectiles = (delta: number) => {
  const character = useCharacter.getState();
  updateGameState(({ projectiles }) => {
    return {
      projectiles: projectiles
        .map<ProjectileState | null>((p) => {
          if (
            isColliding(
              { x: p.x, y: p.y, size: 5 },
              { x: character.x, y: character.y, size: 40 }
            )
          ) {
            updateCharacter(({ health }) => ({ health: health - 10 }));
            return null;
          }
          const velocityX = Math.cos(p.angle) * PROJECTILE_SPEED * delta;
          const velocityY = Math.sin(p.angle) * PROJECTILE_SPEED * delta;

          return { ...p, x: p.x + velocityX, y: p.y + velocityY };
        })
        .filter<ProjectileState>(
          (p): p is ProjectileState =>
            !!p &&
            p.x > 0 &&
            p.x < WORLD_WIDTH &&
            !isCollidingWithObstacle(p.x, p.y, 5)
        ),
    };
  });
};

const shooter = () => {
  let shootDelay = 0;

  return (
    {
      anchor,
      fireRate,
      autoMode,
      onShoot,
      onDelay,
    }: {
      anchor: { x: number; y: number; angle: number };
      fireRate: number;
      autoMode: boolean;
      onShoot?: () => void;
      onDelay?: () => void;
    },
    delta: number
  ) => {
    if (shootDelay <= 0) {
      updateGameState(({ projectiles }) => ({
        projectiles: [
          ...projectiles,
          {
            ...anchor,
          },
        ],
      }));
      if (onShoot) onShoot();
      shootDelay = autoMode ? 60 : Infinity;
    } else {
      if (onDelay) onDelay();
      shootDelay -= fireRate * delta;
    }
  };
};

let characterShooter: ReturnType<typeof shooter> | null = shooter();

const characterShoot = (delta: number) => {
  const character = useCharacter.getState();

  const { keys } = useGameControls.getState();

  if (!keys[" "]) {
    characterShooter = null;
    updateCharacter({ isShooting: false });
    return;
  }
  if (character.ammo <= 0) return;

  const gun = getGunCoordsByCharacter(character);

  const x = gun.x + 60 * Math.cos(character.gunRotation);
  const y = gun.y + 60 * Math.sin(character.gunRotation);

  if (!characterShooter) {
    characterShooter = shooter();
  }

  characterShooter(
    {
      anchor: {
        x,
        y,
        angle: character.gunRotation,
      },
      fireRate: character.fireRate,
      autoMode: character.autoFireMode,
      onShoot: () =>
        updateCharacter(({ ammo }) => ({ ammo: ammo - 1, isShooting: true })),
      onDelay: () => updateCharacter({ isShooting: false }),
    },
    delta
  );
};

const monitorCharacterHealth = () => {
  const character = useCharacter.getState();
  updateCharacter(updateCharacterHealth(character));
};
const randomShooter = shooter();

const targets = Array.from({ length: 10 }, randomPosition);

const moveEnemy = (enemy: CharacterState, i: number) => {
  const {
    dx: tdx,
    dy: tdy,
    distance: tDistance,
  } = getDistance(targets[i], enemy);

  if (tDistance < 5) {
    targets[i] = randomPosition();
    return enemy;
  }

  const dx = (tdx / tDistance) * enemy.speed;
  const dy = (tdy / tDistance) * enemy.speed;

  if (isCollidingWithObstacle(enemy.x, enemy.y, 40)) {
    targets[i] = randomPosition();
    return {
      ...enemy,
      x: enemy.x - dx,
      y: enemy.y - dy,
      direction: dx > 0 ? -1 : 1,
      isMoving: true,
    };
  }

  return {
    ...enemy,
    x: enemy.x + dx,
    y: enemy.y + dy,
    direction: dx > 0 ? 1 : -1,
    isMoving: true,
  };
};
const updateEnemies = () => {
  // const character = useCharacter.getState();
  updateGameState(({ enemies, projectiles }) => {
    const hitProjectileIndexes: number[] = [];
    const updatedEnemies = enemies.map((enemy, i) => {
      if (enemy.isDead) return enemy;

      let updatedEnemy = moveEnemy(enemy, i);

      projectiles.forEach((projectile, i) => {
        if (
          isColliding(
            { x: projectile.x, y: projectile.y, size: 5 },
            { x: enemy.x, y: enemy.y, size: 40 }
          )
        ) {
          updatedEnemy = {
            ...updatedEnemy,
            health: updatedEnemy.health - 10,
          };
          hitProjectileIndexes.push(i);
        }
      });

      updatedEnemy = {
        ...updatedEnemy,
        isDead: updatedEnemy.health <= 0,
      };

      return updatedEnemy;
    });

    return {
      enemies: updatedEnemies,
      projectiles: projectiles.filter(
        (_, i) => !hitProjectileIndexes.includes(i)
      ),
    };
  });
};

export const gameLoop = (delta: number) => {
  moveOwnCharacter(delta);
  characterShoot(delta);

  randomShooter(
    {
      anchor: {
        x: 100,
        y: 200,
        // angle: Math.PI / 2,
        angle: 0,
      },
      fireRate: 2,
      autoMode: true,
    },
    delta
  );
  monitorCharacterHealth();
  moveProjectiles(delta);
  updateEnemies();
};
