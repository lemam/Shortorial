import { useCallback, useState } from "react";

const useVideoSize = (): [
  { width: number; height: number },
  (node: HTMLElement | null) => void
] => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const handleResize = (node: HTMLElement | null) => {
    if (node) {
      const rect = node.getBoundingClientRect();
      const width = Math.floor(rect.height * 9) / 16;
      const height = rect.height;
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

export default useVideoSize;
