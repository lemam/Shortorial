import { create } from "zustand";

interface CameraStoreState {
  userPermission: boolean;
  setUserPermission: (state: boolean) => void;
}

const useCameraStore = create<CameraStoreState>(set => ({
  userPermission: true,
  setUserPermission: (state: boolean) => set({ userPermission: state }),
}));

export default useCameraStore;
