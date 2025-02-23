import { useGameControls } from "../../store/controls";
import {
  GameState,
  getNewStarState,
  StarState,
  updateGameState,
  useGameState,
} from "../../store/game";
import {
  CharacterState,
  getProjectileAnchorByCharacter,
  getRandomCharacterType,
  moveOwnCharacter,
} from "./character";
import { isColliding } from "./entity";
import { isCollidingWithObstacle } from "./map";
import { getNewProjectileState, shooter, moveProjectiles } from "./projectile";
import { randomPosition, throttle } from "../utils";
import { getAngle, getDistance } from "../utils/math";
import {
  CHARACTER_SPEED,
  STAR_COUNT,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../constants/game";

const updateStarCollection = (
  character: CharacterState,
  stars: StarState[]
): {
  characterStars: number;
  updatedStars: StarState[];
} => {
  let characterStars = character.stars;
  const updatedStars = stars.map((star) => {
    if (isColliding(star, character)) {
      characterStars++;
      return getNewStarState();
    }

    return star;
  });

  return {
    characterStars,
    updatedStars,
  };
};

const characterShooter: ReturnType<typeof shooter> = shooter();
const characterShoot = (prevChar: CharacterState, delta: number) => {
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

const updateOwnCharacter = (prevChar: CharacterState, delta: number) => {
  if (prevChar.health <= 0) return prevChar;
  return {
    ...prevChar,
    ...moveOwnCharacter(prevChar, delta),
    ...characterShoot(prevChar, delta),
  };
};

const targets = Array.from({ length: 10 }, randomPosition);
const moveEnemy = (enemy: CharacterState, i: number, delta: number) => {
  const {
    dx: tdx,
    dy: tdy,
    distance: tDistance,
  } = getDistance(targets[i], enemy);

  if (tDistance < 5) {
    targets[i] = randomPosition();
    return enemy;
  }

  const dx = (tdx / tDistance) * enemy.speed * delta;
  const dy = (tdy / tDistance) * enemy.speed * delta;

  if (isCollidingWithObstacle(enemy)) {
    targets[i] = randomPosition();
    return {
      x: enemy.x - dx,
      y: enemy.y - dy,
      direction: dx > 0 ? -1 : 1,
      isMoving: true,
    };
  }

  return {
    x: enemy.x + dx,
    y: enemy.y + dy,
    direction: dx > 0 ? 1 : -1,
    isMoving: true,
  };
};

const shooters: Array<ReturnType<typeof shooter>> = Array.from(
  {
    length: 10,
  },
  shooter
);
const shootEnemy = (
  enemy: CharacterState,
  i: number,
  character: CharacterState,
  delta: number
) => {
  if (enemy.ammo <= 0) return { isShooting: false };
  const { distance: tDistance } = getDistance(
    {
      x: character.x + Math.random() * 10,
      y: character.y + Math.random() * 10,
    },
    enemy
  );

  if (tDistance < 200 && character.health > 0) {
    const angle = getAngle(enemy, character);
    const shot = shooters[i].shoot(
      {
        autoMode: enemy.autoFireMode,
        fireRate: enemy.fireRate,
      },
      delta
    );

    if (shot) {
      const projectile = getNewProjectileState({
        anchor: getProjectileAnchorByCharacter(enemy),
        angle,
      });
      return {
        isShooting: true,
        gunRotation: angle,
        projectiles: [...enemy.projectiles, projectile],
      };
    }
    return { isShooting: false };
  }

  shooters[i].reset();
  return { isShooting: false };
};

const updateEnemy = (
  enemy: CharacterState,
  i: number,
  character: CharacterState,
  delta: number
) => {
  if (enemy.health <= 0) return enemy;
  return {
    ...enemy,
    ...moveEnemy(enemy, i, delta),
    ...shootEnemy(enemy, i, character, delta),
  };
};

const getNewEnemy = (conf: Partial<CharacterState> = {}): CharacterState => {
  return {
    id: getRandomCharacterType(),
    ...randomPosition(),
    height: 80,
    width: 40,
    direction: 1,
    isMoving: false,
    isShooting: false,
    fireRate: 2,
    ammo: 100,
    autoFireMode: true,
    gunRotation: 0,
    health: 50,
    speed: 2,
    projectiles: [],
    kills: 0,
    stars: 0,
    ...conf,
  };
};

const addNewEnemy = () => {
  updateGameState(({ enemies }) => ({
    enemies: [...enemies, getNewEnemy()],
  }));
  targets.push(randomPosition());
  shooters.push(shooter());
};

const throttledAddEnemy = throttle(addNewEnemy, 5000);

export const gameLoop = (delta: number) => {
  const { character } = useGameState.getState();
  if (character.health <= 0) return;
  updateGameState(({ character, enemies, stars }) => {
    const updatedCharacter = updateOwnCharacter(character, delta);
    const updatedEnemies = enemies.map((enemy, i) =>
      updateEnemy(enemy, i, character, delta)
    );

    // Track star collection
    const { characterStars, updatedStars } = updateStarCollection(
      character,
      stars
    );
    updatedCharacter.stars = characterStars;

    // Track healths
    updatedEnemies.forEach((enemy) => {
      // Track character hits by enemy projectiles
      if (character.health > 0) {
        enemy.projectiles = enemy.projectiles.filter((projectile) => {
          if (isColliding(character, projectile)) {
            updatedCharacter.health -= 10;
            return false;
          }
          return true;
        });
      }
      // Move enemy projectiles
      enemy.projectiles = moveProjectiles(enemy.projectiles, delta);

      // Track enemy hits by character projectiles
      // Ignore dead enemies
      if (enemy.health <= 0) return enemy;
      updatedCharacter.projectiles = updatedCharacter.projectiles.filter(
        (projectile) => {
          if (isColliding(enemy, projectile)) {
            enemy.health -= 10;
            if (enemy.health <= 0) updatedCharacter.kills += 1;
            return false;
          }
          return true;
        }
      );
    });

    // Move projectiles
    updatedCharacter.projectiles = moveProjectiles(
      updatedCharacter.projectiles,
      delta
    );

    return {
      character: updatedCharacter,
      enemies: updatedEnemies,
      stars: updatedStars,
    };
  });
  throttledAddEnemy();
};

export const POINTS_FOR_STAR = 10;
export const POINTS_FOR_KILL = 5;
export const POINTS_FOR_SURVIVAL = 1;

export const offlineScoreCounter = () => {
  let lastTime = Date.now();
  return {
    reset: () => {
      lastTime = Date.now();
    },
    getCount: (character: CharacterState) => {
      let score = 0;
      // 10 points on collecting star
      score += character.stars * POINTS_FOR_STAR;

      // 5 points on killing enemy
      score += character.kills * POINTS_FOR_KILL;

      // 1 point on 1sec survival
      const currentTime = Date.now();
      if (currentTime - lastTime >= 1000) {
        score += POINTS_FOR_SURVIVAL;
        lastTime = currentTime;
      }

      return score;
    },
  };
};

export const getInitialGameState = (): GameState => {
  return {
    character: {
      id: 4,
      width: 40,
      height: 80,
      x: WORLD_WIDTH / 2,
      y: WORLD_HEIGHT / 2,
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
    },
    stars: Array.from({ length: STAR_COUNT }, getNewStarState),
    enemies: Array.from({ length: 5 }).map<CharacterState>(() => getNewEnemy()),
  };
};
