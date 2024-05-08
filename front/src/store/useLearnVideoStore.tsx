import { RefObject, createRef } from "react";
import { create } from "zustand";
import { VideoSection } from "../constants/types";

interface LearnVideoStoreState {
  videoRef: RefObject<HTMLVideoElement>;
  sectionList: VideoSection[] | null;
  currentTime: number;
  isLoop: boolean;
  loopSection: VideoSection | null;
  videoDuration: number;

  computed: {
    currentSection: () => VideoSection;
  };

  action: {
    setSectionList: (list: VideoSection[]) => void;
    setCurrentTime: (time: number) => void;
    setIsLoop: (isLoop: boolean) => void;
    setLoopSection: (section: VideoSection | null) => void;
    setVideoDuration: (duration: number) => void;

    loadSectionList: () => VideoSection[];
    moveVideoTime: (time: number) => void;
    loopVideoSetion: () => void;
  };
}

const useLearnVideoStore = create<LearnVideoStoreState>((set, get) => ({
  videoRef: createRef<HTMLVideoElement>(),
  sectionList: null,
  currentTime: 0,
  isLoop: false,
  loopSection: null,
  videoDuration: 0,

  computed: {
    // 현재 동영상의 구간을 반환한다.
    currentSection: () => {
      const list = get().sectionList;
      const currentTime = get().videoRef.current?.currentTime ?? 0;
      let result: VideoSection | undefined;

      if (list) result = list.find((item) => currentTime >= item.start && currentTime < item.end);
      return result ?? { id: 0, start: 0, end: 0 };
    },
  },

  action: {
    setSectionList: (list: VideoSection[]) => set({ sectionList: list }),
    setCurrentTime: (newTime: number) => set({ currentTime: newTime }),
    setIsLoop: (isLoop: boolean) => set({ isLoop }),
    setLoopSection: (newSection: VideoSection | null) => set({ loopSection: newSection }),
    setVideoDuration: (duration: number) => set({ videoDuration: duration }),

    // 동영상의 구간 리스트를 반환한다. 구간은 3초를 기준으로 나눈다.
    loadSectionList: () => {
      const video = get().videoRef.current;
      const result: VideoSection[] = [];

      if (video) {
        const secondsPerSection = 3;
        const numberOfSections = video.duration / 3;

        for (let i = 0; i < numberOfSections; i++) {
          result.push({
            id: i,
            start: i * secondsPerSection,
            end: (i + 1) * secondsPerSection,
          });
        }

        get().action.setSectionList(result);
      }

      return result;
    },

    // 동영상의 시간을 (time)초로 이동한다.
    moveVideoTime: (time: number) => {
      const video = get().videoRef.current;

      if (video) {
        video.currentTime = time;
        get().action.setCurrentTime(time);
      }
    },

    // 동영상을 (loopSection) 구간만큼 반복 재생한다.
    loopVideoSetion: () => {
      const section = get().loopSection;
      const video = get().videoRef.current;

      if (video && section) {
        if (video.currentTime >= section.end || video.ended) {
          video.currentTime = section.start;
          video.play();
        }
      }
    },
  },
}));

export default useLearnVideoStore;
