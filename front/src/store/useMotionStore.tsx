import { create } from "zustand";

interface BtnState {
  btn: String;
  setBtn: (newBtn: String) => void;
}

export const useBtnStore = create<BtnState>((set) => ({
  btn: "none",
  setBtn: (newBtn: String) => set({ btn: newBtn }),
}));
