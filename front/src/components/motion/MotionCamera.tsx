import { NormalizedLandmark, DrawingUtils } from "@mediapipe/tasks-vision";
import { useEffect } from "react";
import { createPoseLandmarker, predictWebcam } from "../../modules/Motion";
import { useBtnStore, useActionStore } from "../../store/useMotionStore";
import { styled } from "styled-components";

interface MotionCameraType {
  width: number;
  height: number;
  className: string;
  autoPlay: boolean;
  isCanvas: boolean;
}

export default function MotionCamera({
  width,
  height,
  className,
  autoPlay,
  isCanvas,
}: MotionCameraType) {
  const { setBtn } = useBtnStore();
  const { setAction } = useActionStore();

  // console.log(isCanvas);
  useEffect(() => {
    // 모델 초기화
    createPoseLandmarker();
    const canvasElement = document.getElementById(
      "canvas"
    ) as HTMLCanvasElement | null;
    let canvasCtx: CanvasRenderingContext2D | null = null;
    // 그리기 도구
    let drawingUtils: DrawingUtils | null = null;

    if (canvasElement) canvasCtx = canvasElement.getContext("2d");
    if (canvasCtx) drawingUtils = new DrawingUtils(canvasCtx);

    // camera가 있을 HTML
    const webcam = document.getElementById("webcam") as HTMLVideoElement | null;
    // 최종 그림이 나갈 HTML

    // 카메라가 있는지 확인
    const isGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;

    // 모션인식 코드
    const lastWebcamTime = -1;
    const before_handmarker: NormalizedLandmark | null = null;
    const curr_handmarker: NormalizedLandmark | null = null;

    // 카메라가 있으면 작동 - 페이지 접근시 바로 카메라 켜지고 화면에 보이도록 설정
    if (isGetUserMedia() && webcam) {
      // getUsermedia parameters.
      const constraints: MediaStreamConstraints = {
        video: {
          aspectRatio: 9 / 16,
        },
        audio: false,
      };

      // 카메라 스트리밍 시작 + 모션인식
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        if (webcam) {
          webcam.srcObject = stream;
          webcam.addEventListener("loadeddata", () =>
            predictWebcam(
              "learn",
              webcam,
              canvasCtx,
              canvasElement,
              drawingUtils,
              lastWebcamTime,
              before_handmarker,
              curr_handmarker,
              setBtn,
              setAction
            )
          );
        }
      });
    }
    if (webcam) {
      const cleanup = () => {
        const stream = webcam?.srcObject as MediaStream;
        const tracks = stream?.getTracks();
        tracks?.forEach((track) => track.stop());
        webcam.srcObject = null;
      };

      window.addEventListener("popstate", cleanup);
      return () => {
        cleanup();
        window.removeEventListener("popstate", cleanup);
      };
    }
  }, [setBtn, setAction]);

  return (
    <div id="motion">
      <video
        id="webcam"
        width={width}
        height={height}
        className={className}
        autoPlay={autoPlay}
        playsInline
      ></video>
      <Canvas
        id="canvas"
        width={width}
        height={height}
        style={{ objectFit: "cover" }}
        isCanvas={isCanvas}
      ></Canvas>
    </div>
  );
}

const Canvas = styled.canvas<{ isCanvas: boolean }>`
  position: absolute;
  display: ${(props) => (props.isCanvas ? "flex" : "none")};
  color: black;
  top: 0;
  left: 0;
`;
