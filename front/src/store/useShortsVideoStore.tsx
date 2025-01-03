import { create } from "zustand";

interface ShortsVideoStore {
  isMuted: boolean;
  toggleMute: () => void;
}

const useShortsVideoStore = create<ShortsVideoStore>((set, get) => ({
  isMuted: true,
  toggleMute: () => set({ isMuted: !get().isMuted }),
}));

export default useShortsVideoStore;
