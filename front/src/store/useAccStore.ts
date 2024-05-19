import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { create } from "zustand";

interface videoLandmarkState {
  videoLandmark: NormalizedLandmark[] | null;
  setVideoLandmark: (newLandmark: NormalizedLandmark[]) => void;
}

export const useVideoLandmarkStore = create<videoLandmarkState>((set) => ({
  videoLandmark: null,
  setVideoLandmark: (newLandmark: NormalizedLandmark[]) =>
    set({ videoLandmark: newLandmark }),
}));

interface motionLandmarkState {
  motionLandmark: NormalizedLandmark[] | null;
  setMotionLandmark: (newLandmark: NormalizedLandmark[]) => void;
}

export const useMotionLandmarkStore = create<motionLandmarkState>((set) => ({
  motionLandmark: null,
  setMotionLandmark: (newLandmark: NormalizedLandmark[]) =>
    set({ motionLandmark: newLandmark }),
}));

interface valueState {
  accValue: number;
  setAccValue: (newAccValue: number) => void;
}

export const useValueStore = create<valueState>((set) => ({
  accValue: 0,
  setAccValue: (newAccValue: number) => set({ accValue: newAccValue }),
}));

interface countState {
  count: number;
  setCount: (newCount: number) => void;
}

export const useCountStore = create<countState>((set) => ({
  count: 0,
  setCount: (newCount: number) => set({ count: newCount }),
}));
