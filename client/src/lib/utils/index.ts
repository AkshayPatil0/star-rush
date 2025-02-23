import { WORLD_HEIGHT, WORLD_WIDTH } from "../constants/game";

export const randomPosition = () => ({
  x: Math.random() * (WORLD_WIDTH - 50),
  y: Math.random() * (WORLD_HEIGHT - 50),
});

export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): T {
  let lastCall = 0;

  return function (...args: Parameters<T>) {
    const now = Date.now();

    if (now - lastCall >= limit) {
      lastCall = now;
      func(...args);
    }
  } as T;
}
