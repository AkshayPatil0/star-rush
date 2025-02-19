import Joystick from "./Joystick";
import {
  JoystickState,
  updateGameControls,
  useGameControls,
} from "../store/controls";
import { useKeyboard } from "../hooks/useKeyboard";
import { useEffect, useState } from "react";

const GameControls: React.FC = () => {
  const keys = useKeyboard();
  const { camera } = useGameControls();
  const [clientCoords, setClientCoords] = useState({ clientX: 0, clientY: 0 });

  const setJoystickInput = (joystickInput: JoystickState) => {
    updateGameControls({ joystickInput });
  };

  useEffect(() => {
    updateGameControls({ keys });
  }, [keys]);

  useEffect(() => {
    const { clientX, clientY } = clientCoords;
    updateGameControls({
      cursorInput: { x: clientX + camera.x, y: clientY + camera.y },
    });
  }, [clientCoords, camera]);

  useEffect(() => {
    const listener = ({ clientX, clientY }: MouseEvent) => {
      setClientCoords({ clientX, clientY });
    };
    window.addEventListener("mousemove", listener);
    return () => window.removeEventListener("mousemove", listener);
  }, []);

  return <Joystick onMove={(dx, dy) => setJoystickInput({ dx, dy })} />;
};

export default GameControls;
