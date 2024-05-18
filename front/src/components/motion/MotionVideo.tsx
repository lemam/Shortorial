import { useEffect, useRef } from "react";
import {
  PoseLandmarker,
  FilesetResolver,
  NormalizedLandmark,
} from "@mediapipe/tasks-vision";
import { useVideoLandmarkStore } from "../../store/useAccStore";
interface VideoType {
  width: number;
  height: number;
  src: string;
  ref: React.RefObject<HTMLVideoElement>;
  className: string;
}

export default function MotionVideo({
  width,
  height,
  src,
  ref,
  className,
}: VideoType) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let videoRunning = true;

    const setVideoLandmark = useVideoLandmarkStore.getState().setVideoLandmark;
    // 비디오 재생 상태를 감시하는 이벤트 리스너 추가
    const handlePlay = () => {
      videoRunning = true;
      predictVideo();
    };

    const handlePause = () => {
      // if (canvasElement) canvasElement.style.display = "none";
      videoRunning = false;
    };

    videoRef.current?.addEventListener("play", handlePlay);
    videoRef.current?.addEventListener("pause", handlePause);

    // poseLandmarker instance를 저장할 변수
    let poseLandmarker: PoseLandmarker | null = null;

    // PoseLandmarker 인스턴스 초기화
    const createPoseLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 2,
      });
    };

    // 그림 그리기 초기화
    createPoseLandmarker();

    const video = document.getElementById("video") as HTMLVideoElement | null;

    let lastVideoTime = -1;

    async function predictVideo() {
      if (!video || !poseLandmarker) return null;

      let startTimeMs = performance.now();
      if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
          for (const landmark of result.landmarks) {
            setVideoLandmark(landmark);
          }
        });
      }

      if (videoRunning === true) {
        window.requestAnimationFrame(predictVideo);
      }
    }

    predictVideo();

    return () => {
      // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거
      videoRef.current?.removeEventListener("play", handlePlay);
      videoRef.current?.removeEventListener("pause", handlePause);
    };
  }, []);

  return (
    <video
      width={width}
      height={height}
      src={src}
      ref={ref}
      className={className}
      crossOrigin="anonymous"
    ></video>
  );
}
