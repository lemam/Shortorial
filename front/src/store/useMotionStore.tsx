import { create } from "zustand";

interface VisibleState {
  visibleBtn: boolean;
  setVisibleBtn: (newVisibleBtn: boolean) => void;
}

interface TimerState {
  timerBtn: boolean;
  setTimerBtn: (newTimerBtn: boolean) => void;
}

export const useVisibleStore = create<VisibleState>((set) => ({
  visibleBtn: false,
  setVisibleBtn: (newVisibleBtn: boolean) => set({ visibleBtn: newVisibleBtn }),
}));

export const useTimerStore = create<TimerState>((set) => ({
  timerBtn: false,
  setTimerBtn: (newTimerBtn: boolean) => set({ timerBtn: newTimerBtn }),
}));
