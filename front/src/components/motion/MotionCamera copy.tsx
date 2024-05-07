import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils,
  NormalizedLandmark,
  GestureRecognizer,
  HandLandmarker,
} from "@mediapipe/tasks-vision";
import { useEffect } from "react";
import { btn_with_landmark } from "../../modules/MotionBtn";
import { ZoomInMapTwoTone } from "@mui/icons-material";

interface MotionCameraType {
  width: number;
  height: number;
}

export default function MotionCamera({ width, height }: MotionCameraType) {
  useEffect(() => {
    ZoomInMapTwoTone;
    // moiton을 그릴 HTML
    const motionSection = document.getElementById(
      "motion"
    ) as HTMLCanvasElement | null;
    // poseLandmarker instance를 저장할 변수
    let poseLandmarker: PoseLandmarker | null = null;
    // 모드 분류
    let enableWebcamButton: HTMLElement | null;
    let webcamRunning = false;

    // poseLandmarker 초기화
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

      const gestureRecognizer = await GestureRecognizer.createFromModelPath(
        vision,
        "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task"
      );

      if (motionSection) motionSection.classList.remove("invisible");
    };

    createPoseLandmarker();
    // camera가 있을 HTML
    const webcam = document.getElementById("webcam") as HTMLVideoElement | null;
    // 최종 그림이 나갈 HTML
    const canvasElement = document.getElementById(
      "output_canvas"
    ) as HTMLCanvasElement | null;
    let canvasCtx: CanvasRenderingContext2D | null = null;
    // 그리기 도구
    let drawingUtils: DrawingUtils | null = null;

    if (canvasElement) canvasCtx = canvasElement.getContext("2d");
    if (canvasCtx) drawingUtils = new DrawingUtils(canvasCtx);

    let canvasElementTest2 = document.getElementById(
      "test2_canvas"
    ) as HTMLCanvasElement | null;
    let canvasCtxTest2: CanvasRenderingContext2D | null = null;
    let drawingUtilsTest2: DrawingUtils | null = null;

    if (canvasElementTest2)
      canvasCtxTest2 = canvasElementTest2.getContext("2d");
    if (canvasCtxTest2) drawingUtilsTest2 = new DrawingUtils(canvasCtxTest2);

    // 카메라가 있는지 확인
    const isGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;

    // 카메라가 있으면 작동
    if (isGetUserMedia()) {
      enableWebcamButton = document.getElementById("webcamButton");
      if (enableWebcamButton)
        enableWebcamButton.addEventListener("click", enableCam);
      console.log("카메라가 인식되었습니다.");
    } else {
      console.warn("getUserMedia() is not supported by your browser");
      alert("인식된 카메라가 없습니다.");
    }

    function enableCam() {
      if (!poseLandmarker) {
        console.log("Wait! poseLandmaker not loaded yet.");
        return;
      }
      if (webcamRunning === true) {
        webcamRunning = false;
        if (enableWebcamButton)
          enableWebcamButton.innerText = "ENABLE PREDICTIONS";
      } else {
        webcamRunning = true;
        if (enableWebcamButton)
          enableWebcamButton.innerText = "DISABLE PREDICTIONS";
      }
      // getUsermedia parameters.
      const constraints = {
        video: true,
      };

      // Activate the webcam stream.
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        if (webcam) {
          webcam.srcObject = stream;
          webcam.addEventListener("loadeddata", predictWebcam);
        }
      });
    }

    let cnt = 0;
    const MAX_COUNT: number = 2;

    let lastWebcamTime = -1;
    async function predictWebcam() {
      if (!canvasElement || !webcam || !poseLandmarker) return null;

      // Now let's start detecting the stream.
      let startTimeMs = performance.now();
      if (lastWebcamTime !== webcam.currentTime) {
        lastWebcamTime = webcam.currentTime;

        poseLandmarker.detectForVideo(webcam, startTimeMs, (result) => {
          if (!canvasCtx || !drawingUtils) return null;
          if (!canvasCtxTest2 || !drawingUtilsTest2 || !canvasElementTest2)
            return null;

          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
          for (const landmark of result.landmarks) {
            // if (cnt == 0) {
            //   sumLandmark2 = [...landmark];
            // } else {
            //   if (sumLandmark2) {
            //     for (let idx = 0; idx < landmark.length; idx++) {
            //       sumLandmark2[idx].x += landmark[idx].x;
            //       sumLandmark2[idx].y += landmark[idx].y;
            //       sumLandmark2[idx].z += landmark[idx].z;
            //     }
            //   }
            // }
            // if (cnt === MAX_COUNT && sumLandmark2) {
            //   canvasCtxTest2.clearRect(
            //     0,
            //     0,
            //     canvasElementTest2.width,
            //     canvasElementTest2.height
            //   );
            //   for (const landmark of sumLandmark2) {
            //     landmark.x /= cnt + 1; // 랜드마크의 개수로 나누어 평균을 계산
            //     landmark.y /= cnt + 1;
            //     landmark.z /= cnt + 1;
            //   }
            //   drawingUtilsTest2.drawLandmarks(sumLandmark2, {
            //     radius: (data: any) =>
            //       DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1),
            //   });
            //   drawingUtilsTest2.drawConnectors(
            //     sumLandmark2,
            //     PoseLandmarker.POSE_CONNECTIONS
            //   );
            //   canvasCtxTest2.restore();
            // }

            btn_with_landmark(landmark[18]);
            drawingUtils.drawLandmarks(landmark, {
              radius: (data: any) =>
                DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1),
            });
            drawingUtils.drawConnectors(
              landmark,
              PoseLandmarker.POSE_CONNECTIONS
            );
          }
          canvasCtx.restore();
        });
      }

      // Call this function again to keep predicting when the browser is ready.
      if (webcamRunning === true) {
        if (cnt > MAX_COUNT) {
          // console.log(cnt);
          // console.log(sumLandmark2);
          // console.log("============================");
          cnt = 0;
        } else {
          cnt++;
        }
        webcam.style.display = "block";
        canvasElement.style.display = "block";
        window.requestAnimationFrame(predictWebcam);
      } else {
        webcam.pause();
        const stream = webcam.srcObject as MediaStream;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
        webcam.style.display = "none";
        canvasElement.style.display = "none";
      }
    }
  }, []);

  return (
    <div id="motion" className="invisible">
      <video
        id="webcam"
        width={width}
        height={height}
        style={{ objectFit: "cover" }}
        autoPlay
        playsInline
      ></video>
      <canvas
        id="output_canvas"
        width={width}
        height={height}
        style={{ objectFit: "cover" }}
      ></canvas>
      <canvas
        id="test2_canvas"
        width={width}
        height={height}
        style={{ objectFit: "cover" }}
      ></canvas>
      <button
        id="webcamButton"
        style={{ backgroundColor: "white", color: "black" }}
      >
        ENABLE PREDICTIONS
      </button>
    </div>
  );
}
