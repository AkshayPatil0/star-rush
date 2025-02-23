import rock1Img from "../../assets/environment/rock1.png";
import rock2Img from "../../assets/environment/rock2.png";
import rock3Img from "../../assets/environment/rock3.png";
import { WORLD_HEIGHT, WORLD_WIDTH } from "../constants/game";
import { clamp } from "../utils/math";
import { Entity, isColliding } from "./entity";

export interface Obstacle extends Entity {
  image: string;
}

export class Rock1 implements Obstacle {
  height: number;
  width: number;
  image: string;
  constructor(
    public x: number,
    public y: number
  ) {
    this.height = 70;
    this.width = 120;
    this.image = rock1Img;
  }
}

export class Rock2 implements Obstacle {
  height: number;
  width: number;
  image: string;
  constructor(
    public x: number,
    public y: number
  ) {
    this.height = 80;
    this.width = 110;
    this.image = rock2Img;
  }
}

export class Rock3 implements Obstacle {
  height: number;
  width: number;
  image: string;
  constructor(
    public x: number,
    public y: number
  ) {
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

export const isCollidingWithObstacle = (obj: Entity): boolean => {
  return ObstacleMap.some((obstacle) => isColliding(obj, obstacle));
};

export const boundEntityMovement = ({
  object,
  moveX,
  moveY,
}: {
  object: Entity;
  moveX: number;
  moveY: number;
}) => {
  const { x, y, height, width } = object;
  let newX = clamp(width / 2, WORLD_WIDTH - width / 2)(x + moveX);

  let newY = clamp(height / 2, WORLD_HEIGHT - height / 2)(y + moveY);

  if (isCollidingWithObstacle({ ...object, y: newY })) {
    newY = y;
  }

  if (isCollidingWithObstacle({ ...object, x: newX })) {
    newX = x;
  }

  return { x: newX, y: newY };
};
