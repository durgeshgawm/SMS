import { useEffect } from "react";

export function useKeyboardShortcut(
  key: string,
  callback: (e: KeyboardEvent) => void,
  metaKey: boolean = true
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMeta = metaKey ? (event.metaKey || event.ctrlKey) : true;
      if (isMeta && event.key.toLowerCase() === key.toLowerCase()) {
        event.preventDefault();
        callback(event);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [key, callback, metaKey]);
}
