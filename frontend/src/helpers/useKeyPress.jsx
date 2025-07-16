import { useEffect } from "react";

export function useKeyPress(targetKeys, callback) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (targetKeys.includes(event.key)) {
        callback(event.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [targetKeys, callback]);
}
