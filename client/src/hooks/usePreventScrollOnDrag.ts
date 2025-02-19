import { useLayoutEffect } from "react";

export const usePreventScrollOnDrag = () => {
  useLayoutEffect(() => {
    const listener = (e: TouchEvent) => {
      e.preventDefault();
    };
    document.addEventListener("touchmove", listener, { passive: false });

    return () => document.removeEventListener("touchmove", listener);
  }, []);
};
