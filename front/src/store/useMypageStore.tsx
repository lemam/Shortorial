import { create } from "zustand";
import { UploadShorts, shorts } from "../apis/shorts";

const useMypageStore = create((set) => ({
  uploadedShorts: [], // 업로드한 동영상 리스트
  tryShorts: [], // 시도한 영상 리스트
  // 업로드한 동영상 리스트 업데이트
  setUploadedShorts: (UploadShorts: UploadShorts) => set({ uploadedShorts: UploadShorts }),
  // 시도한 영상 리스트 업데이트
  setTryShorts: (shorts: shorts) => set({ tryShorts: shorts }),
}));

export default useMypageStore;
