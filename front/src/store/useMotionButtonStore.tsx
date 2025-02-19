import { create } from "zustand";
import { MotionButton } from "../constants/types";

interface MotionButtonState {
  buttons: MotionButton[];
  progress: number;
  setButtons: (buttons: MotionButton[]) => void;
  getButtons: () => MotionButton[];
  setProgress: (progress: number) => void;
  getProgress: () => number;
}

const useMotionButtonStore = create<MotionButtonState>((set, get) => ({
  buttons: [],
  progress: 0,

  setButtons: buttons => set({ buttons }),
  getButtons: () => get().buttons,

  setProgress: progress => set({ progress }),
  getProgress: () => get().progress,
}));

export default useMotionButtonStore;
