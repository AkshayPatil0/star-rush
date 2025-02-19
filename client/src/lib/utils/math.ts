export const clamp = (min: number, max: number) => (num: number) => {
  return Math.min(Math.max(num, min), max);
};

export const getDistance = (
  obj1: { x: number; y: number },
  obj2: { x: number; y: number }
) => {
  const dx = obj1.x - obj2.x;
  const dy = obj1.y - obj2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return { dx, dy, distance };
};
