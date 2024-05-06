import { PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { useEffect } from "react";
import { btn_with_landmark } from "../../modules/MotionBtn";

interface MotionCameraType {
  width: number;
  height: number;
}

export default function MotionCamera({ width, height }: MotionCameraType) {
  useEffect(() => {
    // poseLandmarker instance를 저장할 변수
    let poseLandmarker: PoseLandmarker | null = null;

    // 모드 분류
    // let webcamRunning = false;

    // poseLandmarker 초기화
    // 모션인식 모델 불러오기
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

    // 모델 초기화
    createPoseLandmarker();

    // camera가 있을 HTML
    const webcam = document.getElementById("webcam") as HTMLVideoElement | null;
    // 최종 그림이 나갈 HTML

    // 카메라가 있는지 확인
    const isGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;

    // 카메라가 있으면 작동 - 페이지 접근시 바로 카메라 켜지고 화면에 보이도록 설정
    if (isGetUserMedia() && webcam) {
      // getUsermedia parameters.
      const constraints = {
        video: true,
      };

      // 카메라 스트리밍 시작
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        if (webcam) {
          webcam.srcObject = stream;
          webcam.addEventListener("loadeddata", predictWebcam);
        }
      });

      // 모션인식 시작
      predictWebcam();
    }

    // 모션인식 코드
    let lastWebcamTime = -1;
    async function predictWebcam() {
      if (!webcam || !poseLandmarker) return null;

      // Now let's start detecting the stream.
      let startTimeMs = performance.now();
      if (lastWebcamTime !== webcam.currentTime) {
        lastWebcamTime = webcam.currentTime;

        poseLandmarker.detectForVideo(webcam, startTimeMs, (result) => {
          for (const landmark of result.landmarks) {
            // 오른손이 우측 상단에 가면 알려주는 함수
            btn_with_landmark(landmark[18]);
          }
        });
      }

      // 뒤로 가기 하면 webcam 멈추기
      // window.addEventListener("popstate", () => {
      //   webcam.pause();

      // });
      // Call this function again to keep predicting when the browser is ready.
      // if (webcamRunning === true) {
      //   webcam.style.display = "block";
      //   window.requestAnimationFrame(predictWebcam);
      // } else {
      //   webcam.pause();
      //   const stream = webcam.srcObject as MediaStream;
      //   if (stream) {
      //     const tracks = stream.getTracks();
      //     tracks.forEach((track) => track.stop());
      //   }
      //   webcam.style.display = "none";
      // }
    }
  }, []);

  return (
    <div id="motion">
      <video
        id="webcam"
        width={width}
        height={height}
        style={{ objectFit: "cover" }}
        autoPlay
        playsInline
      ></video>
    </div>
  );
}
