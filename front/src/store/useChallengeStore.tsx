import { create } from "zustand";

interface ChallengeStoreState {
  downloadURL: string;
  setDownloadURL: (newDownloadURL: string) => void;
}

const useChallengeStore = create<ChallengeStoreState>((set) => ({
  downloadURL: "",
  setDownloadURL: (newDownloadURL: string) =>
    set({ downloadURL: newDownloadURL }),
}));

export default useChallengeStore;
