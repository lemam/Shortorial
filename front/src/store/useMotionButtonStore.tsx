import { create } from "zustand";
import { MotionButton } from "../constants/types";

interface MotionButtonState {
  buttons: MotionButton[];
  activeButtonId: number;
  progress: number;
  setButtons: (buttons: MotionButton[]) => void;
  getButtons: () => MotionButton[];
  setActiveButtonId: (id: number) => void;
  getActiveButtonId: () => number;
  setProgress: (progress: number) => void;
  getProgress: () => number;
}

const useMotionButtonStore = create<MotionButtonState>((set, get) => ({
  buttons: [],
  activeButtonId: -1,
  progress: 0,

  setButtons: buttons => set({ buttons }),
  getButtons: () => get().buttons,

  setActiveButtonId: id => set({ activeButtonId: id }),
  getActiveButtonId: () => get().activeButtonId,

  setProgress: progress => set({ progress }),
  getProgress: () => get().progress,
}));

export default useMotionButtonStore;
