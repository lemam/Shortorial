export const getComponentSize = (node: HTMLElement | null) => {
  const { width, height } = node?.getBoundingClientRect() ?? {
    width: 0,
    height: 0,
  };

  return { width, height };
};
