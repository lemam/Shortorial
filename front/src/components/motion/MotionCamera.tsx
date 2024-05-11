import { NormalizedLandmark, DrawingUtils } from "@mediapipe/tasks-vision";
import { useEffect } from "react";
import { createPoseLandmarker, predictWebcam } from "../../modules/Motion";
import { useBtnStore } from "../../store/useMotionStore";

interface MotionCameraType {
  width: number;
  height: number;
  className: string;
  autoPlay: boolean;
}

export default function MotionCamera({
  width,
  height,
  className,
  autoPlay,
}: MotionCameraType) {
  const { setBtn } = useBtnStore();

  useEffect(() => {
    // 모드 분류
    // let webcamRunning = false;

    // poseLandmarker 초기화
    // 모션인식 모델 불러오기

    // 모델 초기화
    createPoseLandmarker();
    const canvasElement = document.getElementById(
      "output_canvas"
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
          // while (!poseLandmarker) console.log("loading poselandmarker");
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
              setBtn
            )
          );
        }
      });
    }
  }, [setBtn]);

  return (
    <div id="motion">
      <video
        id="webcam"
        width={width}
        height={height}
        // style={{ objectFit: "cover" }}
        className={className}
        autoPlay={autoPlay}
        playsInline
        style={{}}
      ></video>
      {/* <canvas
        id="output_canvas"
        width={width}
        height={height}
        style={{ objectFit: "cover" }}
      ></canvas> */}
    </div>
  );
}
