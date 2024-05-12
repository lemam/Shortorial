import { create } from "zustand";
import { VideoSection } from "../constants/types";

const TIMER_COUNT = 3;
const PLAY_SPEEDS = [1, 0.75, 0.5];

interface test {
  currentTime: number;
  currentSection: VideoSection;
  isLooping: boolean;
  loopSection: VideoSection | null;
  timer: number;
  isFlipped: boolean;
  playSpeed: number;
  playSpeedIdx: number;

  setCurrentTime: (currentTime: number) => void;
  setCurrentSection: (currentSection: VideoSection) => void;
  setIsLooping: (isLooping: boolean) => void;
  setLoopSection: (loopSection: VideoSection | null) => void;
  setIsFlipped: (isFlipped: boolean) => void;
  setPlaySpeed: (playSpeed: number) => void;

  resetTimer: () => void;
  countdownTimer: () => void;
  changePlaySpeed: () => void;
}

const useLearnStore = create<test>((set, get) => ({
  currentTime: 0,
  currentSection: { id: 0, start: 0, end: 0 },
  isLooping: false,
  loopSection: { id: 0, start: 0, end: 0 },
  timer: 0,
  isFlipped: false,
  playSpeed: 1,
  playSpeedIdx: 0,

  setCurrentTime: (currentTime) => set({ currentTime }),
  setCurrentSection: (currentSection) => set({ currentSection }),
  setIsLooping: (isLooping) => set({ isLooping }),
  setLoopSection: (loopSection) => set({ loopSection }),
  setIsFlipped: (isFlipped) => set({ isFlipped }),
  setPlaySpeed: (playSpeed) => set({ playSpeed }),

  resetTimer: () => set({ timer: TIMER_COUNT }),
  countdownTimer: () => set({ timer: get().timer - 1 }),
  changePlaySpeed: () => {
    set({ playSpeedIdx: (get().playSpeedIdx + 1) % PLAY_SPEEDS.length });
    set({ playSpeed: PLAY_SPEEDS[get().playSpeedIdx] });
  },
}));

export default useLearnStore;
