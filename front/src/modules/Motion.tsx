import {
  PoseLandmarker,
  NormalizedLandmark,
  DrawingUtils,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

// 버튼 모션에 활용되는 함수
let visible_count = 0;
let timer_count = 0;
let record_count = 0;
let save_count = 0;
let mode_count = 0;

// 좌우 모션 인식에 활용되는 변수
let left_count = 0;
let right_count = 0;
let poseLandmarker: PoseLandmarker | null = null;
const MAX_COUNT: number = 10;
const TIMER_COUNT: number = 15;
const RECORD_COUNT: number = 30;
// 우측 상단에 접근하면 우측상단! 반환
export function btn_with_landmark(
  handLandmarker: NormalizedLandmark,
  setBtn: (newBtn: String) => void
) {
  if (handLandmarker.x < 0.2 && handLandmarker.visibility > 0.5) {
    if (handLandmarker.y < 0.15) {
      console.log("A");
      if (visible_count >= MAX_COUNT) {
        setBtn("visible");
        visible_count = 0;
        timer_count = 0;
      } else {
        visible_count++;
      }
    } else if (handLandmarker.y > 0.17 && handLandmarker.y < 0.3) {
      if (timer_count >= TIMER_COUNT) {
        setBtn("timer");
        timer_count = 0;
      } else {
        timer_count++;
      }
    } else if (handLandmarker.y > 0.32 && handLandmarker.y < 0.45) {
      if (record_count >= RECORD_COUNT) {
        console.log("re");
        setBtn("record");
        record_count = 0;
      } else {
        record_count++;
      }
    } else if (handLandmarker.y > 0.47 && handLandmarker.y < 0.6) {
      if (save_count >= RECORD_COUNT) {
        console.log("save");
        setBtn("save");
        save_count = 0;
      } else save_count++;
    } else if (handLandmarker.y > 0.62 && handLandmarker.y < 0.75) {
      if (mode_count >= RECORD_COUNT) {
        console.log("mode");
        setBtn("mode");
        mode_count = 0;
      } else mode_count++;
    }
  }
}

// 손 움직이면 좌우 인식
export function action_with_landmark(
  before_handLandmarker: NormalizedLandmark,
  curr_handmarker: NormalizedLandmark
) {
  if (
    before_handLandmarker.visibility > 0.5 &&
    curr_handmarker.visibility > 0.5
  ) {
    // console.log("1 complete");
    if (
      before_handLandmarker.y > 0.3 &&
      before_handLandmarker.y < 0.8 &&
      curr_handmarker.y > 0.3 &&
      curr_handmarker.y < 0.8
    ) {
      //   console.log("2 complete");
      if (before_handLandmarker.x - curr_handmarker.x < 0) {
        right_count = 0;
        left_count++;
        if (left_count > 5) console.log("왼쪽");
      } else if (before_handLandmarker.x - curr_handmarker.x > 0) {
        left_count = 0;
        right_count++;
        if (right_count > 5) console.log("오른쪽");
      } else {
        left_count = right_count = 0;
      }
    }
  }
}

export const createPoseLandmarker = async () => {
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
  }).then((res) => {
    console.log("초기화 완");
    return res;
  });
};

createPoseLandmarker();

export async function predictWebcam(
  webcam: HTMLVideoElement | null,
  canvasCtx: CanvasRenderingContext2D | null,
  canvasElement: HTMLCanvasElement | null,
  drawingUtils: DrawingUtils | null,
  lastWebcamTime: number,
  before_handmarker: NormalizedLandmark | null,
  curr_handmarker: NormalizedLandmark | null,
  setBtn: (newBtn: String) => void
) {
  // console.log("loading...s");
  if (webcam && poseLandmarker) {
    // console.log("Start");
    let startTimeMs = performance.now();
    if (lastWebcamTime !== webcam.currentTime) {
      // console.log("Test");
      lastWebcamTime = webcam.currentTime;

      poseLandmarker.detectForVideo(webcam, startTimeMs, (result) => {
        // if (!canvasCtx || !drawingUtils || !canvasElement) return null;
        // canvasCtx.save();
        // canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        for (const landmark of result.landmarks) {
          // 오른손이 우측 상단에 가면 알려주는 함수
          btn_with_landmark(landmark[18], setBtn);

          if (!before_handmarker) {
            if (landmark[18].visibility > 0.5) {
              before_handmarker = landmark[18];
              console.log("설정완");
            }
          } else {
            curr_handmarker = landmark[18];
            action_with_landmark(before_handmarker, curr_handmarker);
            // console.log(cnt);
            before_handmarker = curr_handmarker;
          }
          // drawingUtils.drawLandmarks(landmark, {
          //   radius: (data: any) =>
          //     DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1),
          // });
          // drawingUtils.drawConnectors(
          //   landmark,
          //   PoseLandmarker.POSE_CONNECTIONS
          // );
        }
        // canvasCtx.restore();
      });
    }
  }
  // 모션인식 계속 진행
  window.requestAnimationFrame(() =>
    predictWebcam(
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
