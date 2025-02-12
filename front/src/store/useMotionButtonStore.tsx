import { create } from "zustand";

interface MotionButton {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  click: () => void;
}

interface MotionButtonState {
  button: MotionButton | null;
  setButton: (rect: MotionButton) => void;
  getButton: () => MotionButton | null;
}

const useMotionButtonStore = create<MotionButtonState>((set, get) => ({
  button: null,
  setButton: rect => set({ button: rect }),
  getButton: () => get().button,
}));

export default useMotionButtonStore;
