import { create } from "zustand";

interface BtnState {
  btn: String;
  setBtn: (newBtn: String) => void;
}

interface DomState {
  domSize: DOMRect | null;
  playSize: DOMRect | null;
  visibleBtnSize: DOMRect | null;
  timerBtnSize: DOMRect | null;
  recordBtnSize: DOMRect | null;
  saveBtnSize: DOMRect | null;
  modeBtnSize: DOMRect | null;
  rsltBtnSize: DOMRect | null;
  setDomSize: (newDomSize: DOMRect) => void;
  setPlaySize: (newDomSize: DOMRect) => void;
  setVisibleBtnSize: (newBtnSize: DOMRect) => void;
  setTimeBtnSize: (newBtnSize: DOMRect) => void;
  setRecordBtnSize: (newBtnSize: DOMRect) => void;
  setSaveBtnSize: (newBtnSize: DOMRect) => void;
  setModeBtnSize: (newBtnSize: DOMRect) => void;
  setRsltBtnSize: (newBtnSize: DOMRect) => void;
}

export const useBtnStore = create<BtnState>((set) => ({
  btn: "none",
  setBtn: (newBtn: String) => set({ btn: newBtn }),
}));

export const useDomStore = create<DomState>((set) => ({
  domSize: null,
  playSize: null,
  visibleBtnSize: null,
  timerBtnSize: null,
  recordBtnSize: null,
  saveBtnSize: null,
  modeBtnSize: null,
  rsltBtnSize: null,

  setDomSize: (newDomSize: DOMRect) => set({ domSize: newDomSize }),
  setPlaySize: (newDomSize: DOMRect) => set({ playSize: newDomSize }),
  setVisibleBtnSize: (newBtnSize: DOMRect) =>
    set({ visibleBtnSize: newBtnSize }),
  setTimeBtnSize: (newBtnSize: DOMRect) => set({ timerBtnSize: newBtnSize }),
  setRecordBtnSize: (newBtnSize: DOMRect) => set({ recordBtnSize: newBtnSize }),
  setSaveBtnSize: (newBtnSize: DOMRect) => set({ saveBtnSize: newBtnSize }),
  setModeBtnSize: (newBtnSize: DOMRect) => set({ modeBtnSize: newBtnSize }),
  setRsltBtnSize: (newBtnSize: DOMRect) => set({ rsltBtnSize: newBtnSize }),
}));
