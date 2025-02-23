import { TouchEventHandler, useState } from "react";

const JOYSTICK_RADIUS = 15;
const JOYSTICK_CONTAINER_RADIUS = 50;

const Joystick: React.FC<{ onMove: (dx: number, dy: number) => void }> = ({
  onMove,
}) => {
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );

  const handleTouchStart: TouchEventHandler<HTMLDivElement> = (event) => {
    const touch = event.touches[0];
    setStart({ x: touch.clientX, y: touch.clientY });
    setPosition({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove: TouchEventHandler<HTMLDivElement> = (event) => {
    if (!start) return;
    const touch = event.touches[0];
    let dx = touch.clientX - start.x;
    let dy = touch.clientY - start.y;

    const clampRadius = JOYSTICK_CONTAINER_RADIUS + JOYSTICK_RADIUS;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > clampRadius) {
      dx = (dx / distance) * clampRadius;
      dy = (dy / distance) * clampRadius;
    }

    setPosition({ x: start.x + dx, y: start.y + dy });
    onMove(dx / JOYSTICK_CONTAINER_RADIUS, dy / JOYSTICK_CONTAINER_RADIUS);
  };

  const handleTouchEnd = () => {
    setStart(null);
    setPosition(null);
    onMove(0, 0);
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 50,
        left: 50,
        width: JOYSTICK_CONTAINER_RADIUS * 2,
        height: JOYSTICK_CONTAINER_RADIUS * 2,
        background: "rgba(0,0,0,0.3)",
        borderRadius: "50%",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {start && position && (
        <div
          style={{
            position: "absolute",
            left:
              position.x -
              start.x +
              JOYSTICK_CONTAINER_RADIUS -
              JOYSTICK_RADIUS,
            top:
              position.y -
              start.y +
              JOYSTICK_CONTAINER_RADIUS -
              JOYSTICK_RADIUS,
            width: JOYSTICK_RADIUS * 2,
            height: JOYSTICK_RADIUS * 2,
            background: "white",
            borderRadius: "50%",
          }}
        />
      )}
    </div>
  );
};

export default Joystick;
