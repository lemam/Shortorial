import { create } from "zustand";

interface BtnState {
  btn: string;
  setBtn: (newBtn: string) => void;
}

interface DomState {
  domSize: DOMRect | null;
  visibleBtnSize: DOMRect | null;
  timerBtnSize: DOMRect | null;
  recordBtnSize: DOMRect | null;
  saveBtnSize: DOMRect | null;
  learnBtnSize: DOMRect | null;
  rsltBtnSize: DOMRect | null;
  setDomSize: (newDomSize: DOMRect) => void;
  setVisibleBtnSize: (newBtnSize: DOMRect) => void;
  setTimeBtnSize: (newBtnSize: DOMRect) => void;
  setRecordBtnSize: (newBtnSize: DOMRect) => void;
  setSaveBtnSize: (newBtnSize: DOMRect) => void;
  setLearnBtnSize: (newBtnSize: DOMRect) => void;
  setRsltBtnSize: (newBtnSize: DOMRect) => void;

  playSize: DOMRect | null;
  challengeSize: DOMRect | null;
  repeatSize: DOMRect | null;
  flipSize: DOMRect | null;
  speedSize: DOMRect | null;

  setPlaySize: (newDomSize: DOMRect) => void;
  setChallengeSize: (newDomSize: DOMRect) => void;
  setRepeatSize: (newDomSize: DOMRect) => void;
  setFlipSize: (newDomSize: DOMRect) => void;
  setSpeedSize: (newDomSize: DOMRect) => void;
}

export const useBtnStore = create<BtnState>((set) => ({
  btn: "none",
  setBtn: (newBtn: string) => set({ btn: newBtn }),
}));

export const useDomStore = create<DomState>((set) => ({
  domSize: null,
  visibleBtnSize: null,
  timerBtnSize: null,
  recordBtnSize: null,
  saveBtnSize: null,
  learnBtnSize: null,
  rsltBtnSize: null,

  playSize: null,
  challengeSize: null,
  repeatSize: null,
  flipSize: null,
  speedSize: null,

  setDomSize: (newDomSize: DOMRect) => set({ domSize: newDomSize }),
  setVisibleBtnSize: (newBtnSize: DOMRect) => set({ visibleBtnSize: newBtnSize }),
  setTimeBtnSize: (newBtnSize: DOMRect) => set({ timerBtnSize: newBtnSize }),
  setRecordBtnSize: (newBtnSize: DOMRect) => set({ recordBtnSize: newBtnSize }),
  setSaveBtnSize: (newBtnSize: DOMRect) => set({ saveBtnSize: newBtnSize }),
  setLearnBtnSize: (newBtnSize: DOMRect) => set({ learnBtnSize: newBtnSize }),
  setRsltBtnSize: (newBtnSize: DOMRect) => set({ rsltBtnSize: newBtnSize }),

  setPlaySize: (newDomSize: DOMRect) => set({ playSize: newDomSize }),
  setChallengeSize: (newDomSize: DOMRect) => set({ challengeSize: newDomSize }),
  setRepeatSize: (newDomSize: DOMRect) => set({ repeatSize: newDomSize }),
  setFlipSize: (newDomSize: DOMRect) => set({ flipSize: newDomSize }),
  setSpeedSize: (newDomSize: DOMRect) => set({ speedSize: newDomSize }),
}));

interface MotionDetection {
  visibleCount: number;
  timerCount: number;
  recordCount: number;
  learnCount: number;
  resultCount: number;
  playCount: number;
  challengeCount: number;
  repeatCount: number;
  flipCount: number;
  speedCount: number;

  setVisibleCount: (newVisibleCount: number) => void;
  setTimerCount: (newTimerCount: number) => void;
  setRecordCount: (newRecordCount: number) => void;
  setLearnCount: (newLearnCount: number) => void;
  setResultCount: (newRsltCount: number) => void;
  setPlayCount: (newPlayCount: number) => void;
  setChallengeCount: (newChallengeCount: number) => void;
  setRepeatCount: (newRepeatCount: number) => void;
  setFlipCount: (newFlipCount: number) => void;
  setSpeedCount: (newSpeedCount: number) => void;
}

export const useMotionDetectionStore = create<MotionDetection>((set) => ({
  visibleCount: 0,
  timerCount: 0,
  recordCount: 0,
  learnCount: 0,
  resultCount: 0,
  playCount: 0,
  challengeCount: 0,
  repeatCount: 0,
  flipCount: 0,
  speedCount: 0,

  setVisibleCount: (newVisibleCount: number) => set({ visibleCount: newVisibleCount }),
  setTimerCount: (newTimerCount: number) => set({ timerCount: newTimerCount }),
  setRecordCount: (newRecordCount: number) => set({ recordCount: newRecordCount }),
  setLearnCount: (newLearnCount: number) => set({ learnCount: newLearnCount }),
  setResultCount: (newRsltCount: number) => set({ resultCount: newRsltCount }),
  setPlayCount: (newPlayCount: number) => set({ playCount: newPlayCount }),
  setChallengeCount: (newChallengeCount: number) => set({ challengeCount: newChallengeCount }),
  setRepeatCount: (newRepeatCount: number) => set({ repeatCount: newRepeatCount }),
  setFlipCount: (newFlipCount: number) => set({ flipCount: newFlipCount }),
  setSpeedCount: (newSpeedCount: number) => set({ speedCount: newSpeedCount }),
}));
