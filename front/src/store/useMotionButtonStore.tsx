import { create } from "zustand";
import { MotionButton } from "../constants/types";

interface MotionButtonState {
  buttons: MotionButton[];
  setButtons: (buttons: MotionButton[]) => void;
  getButtons: () => MotionButton[];
}

const useMotionButtonStore = create<MotionButtonState>((set, get) => ({
  buttons: [],
  setButtons: buttons => set({ buttons }),
  getButtons: () => get().buttons,
}));

export default useMotionButtonStore;
