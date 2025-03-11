import { useCallback, useEffect, useState } from "react";

export const getLocalState = (key: string, storage: Storage) => {
  try {
    const localValue = JSON.parse(storage.getItem(key) || "");
    return localValue.value;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export function useLocalStorageState<T = unknown>(
  key: string,
  storage: Storage = localStorage
) {
  const [state, _setState] = useState<T | null>(() =>
    getLocalState(key, storage)
  );

  useEffect(() => {
    _setState(getLocalState(key, storage));
  }, [key, storage]);

  const setState = useCallback(
    (value: T) => {
      _setState(value);
      storage.setItem(key, JSON.stringify({ value }));
    },
    [key, storage]
  );

  return [state, setState] as const;
}
