import { useCallback } from "react";

export function usePrint() {
  const print = useCallback(() => {
    if (typeof window !== "undefined") {
      window.print();
    }
  }, []);

  return print;
}
