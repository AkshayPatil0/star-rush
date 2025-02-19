import { useCallback, useEffect, useState } from "react";

export const useKeyboard = () => {
  const [keys, setKeys] = useState<Record<string, boolean>>({});

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    setKeys((keys) => ({ ...keys, [event.key]: true }));
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    setKeys((keys) => ({ ...keys, [event.key]: false }));
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return keys;
};
