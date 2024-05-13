import { useCallback, useState } from "react";

const useComponentSize = (): [
  { width: number; height: number },
  (node: HTMLElement | null) => void
] => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const handleResize = (node: HTMLElement | null) => {
    if (node) {
      const { width, height } = node.getBoundingClientRect();
      setSize({ width, height });
    }
  };

  const ref = useCallback((node: HTMLElement | null) => {
    if (node) {
      handleResize(node);
      window.addEventListener("resize", () => handleResize(node));
    } else {
      window.removeEventListener("resize", () => handleResize(node));
    }

    return () => window.removeEventListener("resize", () => handleResize(node));
  }, []);

  return [size, ref];
};

export default useComponentSize;
