import { STAR_HEIGHT, STAR_WIDTH } from "../constants/game";
import { StarState } from "../dtos/game-state";
import { randomPosition } from "../utils";
import { isCollidingWithObstacle } from "../services/map";

export const getNewStarState = (): StarState => {
  const star: StarState = {
    ...randomPosition(),
    height: STAR_HEIGHT,
    width: STAR_WIDTH,
  };
  return isCollidingWithObstacle(star) ? getNewStarState() : star;
};
