export const getComponentSize = (node: HTMLElement | null) => {
  const { width, height } = node?.getBoundingClientRect() ?? { width: 0, height: 0 };
  return { width, height };
};

export const getVideoSize = (node: HTMLElement | null) => {
  let width = 0;
  let height = 0;

  if (node) {
    const rect = node.getBoundingClientRect();
    width = Math.floor(rect.height * 9) / 16;
    height = rect.height;
  }

  return { width, height };
};
