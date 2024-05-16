import { useCallback, useEffect, useRef } from "react";

interface ScrollFadeInOptions {
  direction?: string;
  threshold?: number;
  duration?: number;
}
export default function useScrollFadeIn({
  direction = "up",
  threshold = 0.5,
  duration = 0.5,
}: ScrollFadeInOptions = {}) {
  const dom = useRef<HTMLDivElement | null>(null);

  const handleDirection = (name: string) => {
    switch (name) {
      case "up":
        return "translate3d(0, 5%, 0)";
      case "down":
        return "translate3d(0, -50%, 0)";
      case "left":
        return "translate3d(50%, 0, 0)";
      case "right":
        return "translate3d(-50%, 0, 0)";
      case "none":
        return "translate3d(0, 0, 0)";
      default:
        return;
    }
  };

  const handleScroll = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      const { current } = dom;

      if (current && entry.isIntersecting) {
        current.style.transitionProperty = "opacity transform";
        current.style.transitionDuration = `${duration}s`;
        current.style.transitionTimingFunction = "cubic-bezier(0, 0, 0.2, 1)";
        current.style.transitionDelay = "0s";
        current.style.opacity = "1";
        current.style.transform = "translate3d(0, 0, 0)";
      }
    },
    [duration]
  );

  useEffect(() => {
    let observer: IntersectionObserver;
    const { current } = dom;

    if (current) {
      observer = new IntersectionObserver(handleScroll, {
        threshold: threshold,
      });
      observer.observe(current);

      return () => observer && observer.disconnect();
    }
  }, [handleScroll, threshold]);

  return {
    ref: dom,
    style: {
      opacity: 0,
      transform: handleDirection(direction),
    },
  };
}
