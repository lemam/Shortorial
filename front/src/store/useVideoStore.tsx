import { create } from "zustand";
import { VideoSection } from "../constants/types";

interface test {
  currentSection: VideoSection;
  loopSection: VideoSection | null;

  setCurrentSection: (currentSection: VideoSection) => void;
  setLoopSection: (loopSection: VideoSection) => void;
}

const useVideoStore = create<test>((set) => ({
  currentSection: { id: 0, start: 0, end: 0 },
  loopSection: { id: 0, start: 0, end: 0 },

  setCurrentSection: (currentSection) => set({ currentSection: currentSection }),
  setLoopSection: (loopSection) => set({ loopSection }),
}));

export default useVideoStore;
