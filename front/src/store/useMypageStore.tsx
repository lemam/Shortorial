import { create } from "zustand";
import { UploadShorts, shorts } from "../apis/shorts";

interface MyPageStore {
  uploadedShorts: UploadShorts[];
  tryShorts: shorts[];
  setUploadedShorts: (data: UploadShorts[]) => void;
  setTryShorts: (data: shorts[]) => void;
}

const useMypageStore = create<MyPageStore>((set) => ({
  uploadedShorts: [], // 업로드한 동영상 리스트
  tryShorts: [], // 시도한 영상 리스트
  // 업로드한 동영상 리스트 업데이트
  setUploadedShorts: (data: UploadShorts[]) => set({ uploadedShorts: data }),
  // 시도한 영상 리스트 업데이트
  setTryShorts: (data: shorts[]) => set({ tryShorts: data }),
}));
export default useMypageStore;
