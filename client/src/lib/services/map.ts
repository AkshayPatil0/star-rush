import rock1Img from "../../assets/environment/rock1.png";
import rock2Img from "../../assets/environment/rock2.png";
import rock3Img from "../../assets/environment/rock3.png";
import { CHARACTER_SIZE, WORLD_HEIGHT, WORLD_WIDTH } from "../constants/game";
import { clamp } from "../utils/math";

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  image: string;
}

export class Rock1 implements Obstacle {
  height: number;
  width: number;
  image: string;
  constructor(public x: number, public y: number) {
    this.height = 70;
    this.width = 120;
    this.image = rock1Img;
  }
}

export class Rock2 implements Obstacle {
  height: number;
  width: number;
  image: string;
  constructor(public x: number, public y: number) {
    this.height = 80;
    this.width = 110;
    this.image = rock2Img;
  }
}

export class Rock3 implements Obstacle {
  height: number;
  width: number;
  image: string;
  constructor(public x: number, public y: number) {
    this.height = 80;
    this.width = 120;
    this.image = rock3Img;
  }
}

// Generate obstacles
export const ObstacleMap: Obstacle[] = [
  new Rock1(200, 150),
  new Rock2(400, 300),
  new Rock3(600, 500),
  new Rock1(900, 700),
  new Rock2(1100, 900),
  new Rock3(1300, 1100),
  new Rock1(300, 1000),
  new Rock2(500, 1200),
  new Rock3(700, 1400),
  new Rock1(1500, 200),
  new Rock2(1700, 400),
  new Rock3(1900, 600),
  new Rock1(250, 400),
  new Rock2(450, 600),
  new Rock3(650, 800),
  new Rock1(850, 1000),
  new Rock2(1050, 1200),
  new Rock3(1250, 1400),
  new Rock1(1450, 300),
  new Rock2(1650, 500),
  new Rock3(1850, 700),
  new Rock1(350, 700),
  new Rock2(550, 900),
  new Rock3(750, 1100),
];

export const isCollidingWithObstacle = (
  x: number,
  y: number,
  size: number
): boolean => {
  return ObstacleMap.some((obstacle) => {
    const { x: ox, y: oy, width, height } = obstacle;

    const hr = width / 2 + size / 2;
    const vr = height / 2 + size / 2;
    // Apply ellipse equation
    const normalizedValue = (x - ox) ** 2 / hr ** 2 + (y - oy) ** 2 / vr ** 2;

    // If <= 1, collision detected
    return normalizedValue <= 1;
  });
};

export const boundCharacterMovement = ({
  x,
  y,
  moveX,
  moveY,
}: {
  x: number;
  y: number;
  moveX: number;
  moveY: number;
}) => {
  let newX = clamp(
    CHARACTER_SIZE / 2,
    WORLD_WIDTH - CHARACTER_SIZE / 2
  )(x + moveX);

  let newY = clamp(
    CHARACTER_SIZE / 2,
    WORLD_HEIGHT - CHARACTER_SIZE / 2
  )(y + moveY);

  if (isCollidingWithObstacle(x, newY, 40)) {
    newY = y;
  }

  if (isCollidingWithObstacle(newX, y, 40)) {
    newX = x;
  }

  const isMoving = moveX != 0 || moveY != 0;

  return { x: newX, y: newY, isMoving };
};
