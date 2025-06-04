import { create } from "zustand";
import { MotionButton } from "../constants/types";

interface MotionButtonState {
  buttons: MotionButton[]; // 모션 버튼 위치 배열
  activeButtonId: number; // 모션 감지 중인 버튼 id
  progress: number; // 진행도
  clickButtonId: number; // 클릭할 버튼 id
  isClicked: boolean; // 버튼 클릭 여부
  setButtons: (buttons: MotionButton[]) => void;
  getButtons: () => MotionButton[];
  setActiveButtonId: (id: number) => void;
  getActiveButtonId: () => number;
  setProgress: (progress: number) => void;
  getProgress: () => number;
  setClickButtonId: (id: number) => void;
  getClickButtonId: () => number;
  setIsClicked: (isClicked: boolean) => void;
  getIsClicked: () => boolean;
}

const useMotionButtonStore = create<MotionButtonState>((set, get) => ({
  buttons: [],
  activeButtonId: -1,
  progress: 0,
  clickButtonId: -1,
  isClicked: false,

  setButtons: buttons => set({ buttons }),
  getButtons: () => get().buttons,

  setActiveButtonId: id => set({ activeButtonId: id }),
  getActiveButtonId: () => get().activeButtonId,

  setProgress: progress => set({ progress }),
  getProgress: () => get().progress,

  setClickButtonId: id => set({ clickButtonId: id }),
  getClickButtonId: () => get().clickButtonId,

  setIsClicked: isClicked => set({ isClicked }),
  getIsClicked: () => get().isClicked,
}));

export default useMotionButtonStore;
