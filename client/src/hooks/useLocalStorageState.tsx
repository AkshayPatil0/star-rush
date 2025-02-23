import { useCallback, useEffect, useState } from "react";

export function useLocalStorageState<T = unknown>(key: string) {
  const [state, _setState] = useState<T | null>(null);

  useEffect(() => {
    try {
      const localValue = JSON.parse(localStorage.getItem(key) || "");
      _setState(localValue);
    } catch {
      _setState(null);
    }
  }, [key]);

  const setState = useCallback(
    (value: T) => {
      _setState(value);
      localStorage.setItem(key, JSON.stringify(value));
    },
    [key]
  );

  return [state, setState] as const;
}
