import {
  PoseLandmarker,
  NormalizedLandmark,
  DrawingUtils,
  FilesetResolver,
} from "@mediapipe/tasks-vision";
import { useDomStore } from "../store/useMotionStore";
// import { useDomStore } from "../store/useMotionStore";
import sticker1 from "../assets/sticker1.png";

// 버튼 모션에 활용되는 변수
let visible_count = 0;
let timer_count = 0;
let record_count = 0;
let save_count = 0;
let mode_count = 0;
let rslt_count = 0;

let domSize: DOMRect | null = null;
let visibleBtnSize: DOMRect | null = null;
let timerBtnSize: DOMRect | null = null;
let recorderBtnSize: DOMRect | null = null;
let saveBtnSize: DOMRect | null = null;
let modeBtnSize: DOMRect | null = null;
let rsltBtnSize: DOMRect | null = null;

// 좌우 모션 인식에 활용되는 변수
let left_count = 0;
let right_count = 0;
let poseLandmarker: PoseLandmarker | null = null;
const MAX_COUNT: number = 10;
const TIMER_COUNT: number = 15;
const RECORD_COUNT: number = 30;

// 버튼 누르기
export function btn_with_landmark(
  handLandmarker: NormalizedLandmark,
  setBtn: (newBtn: String) => void
) {
  handLandmarker.x = makeAbsoluteLandmarkX(handLandmarker.x);
  handLandmarker.y = makeAbsoluteLandmarkY(handLandmarker.y);

  // console.log(handLandmarker.y);
  if (
    visibleBtnSize &&
    handLandmarker.x <= visibleBtnSize.right &&
    handLandmarker.x >= visibleBtnSize.left &&
    handLandmarker.visibility > 0.5
  ) {
    console.log("dmdld");
    if (
      handLandmarker.y >= visibleBtnSize.top &&
      handLandmarker.y <= visibleBtnSize.bottom
    ) {
      if (visible_count >= MAX_COUNT) {
        console.log("visible");
        setBtn("visible");
        visible_count = 0;
        timer_count = 0;
      } else {
        visible_count++;
      }
    } else if (
      timerBtnSize &&
      handLandmarker.y >= timerBtnSize.top &&
      handLandmarker.y <= timerBtnSize.bottom
    ) {
      if (timer_count >= TIMER_COUNT) {
        setBtn("timer");
        timer_count = 0;
      } else {
        timer_count++;
      }
    } else if (
      recorderBtnSize &&
      handLandmarker.y >= recorderBtnSize.top &&
      handLandmarker.y <= recorderBtnSize.bottom
    ) {
      if (record_count >= RECORD_COUNT) {
        setBtn("record");
        record_count = 0;
      } else {
        record_count++;
      }
    } else if (
      saveBtnSize &&
      handLandmarker.y >= saveBtnSize.top &&
      handLandmarker.y <= saveBtnSize.bottom
    ) {
      if (save_count >= RECORD_COUNT) {
        console.log("save");
        setBtn("save");
        save_count = 0;
      } else save_count++;
    } else if (
      modeBtnSize &&
      handLandmarker.y >= modeBtnSize.top &&
      handLandmarker.y <= modeBtnSize.bottom
    ) {
      if (mode_count >= RECORD_COUNT) {
        console.log("mode");
        setBtn("mode");
        mode_count = 0;
      } else mode_count++;
    } else if (
      rsltBtnSize &&
      handLandmarker.y >= rsltBtnSize.top &&
      handLandmarker.y <= rsltBtnSize.bottom
    ) {
      if (rslt_count == MAX_COUNT) {
        console.log("rslt");
        setBtn("rslt");
        rslt_count = 0;
      } else rslt_count++;
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

// 포즈 랜드마크 초기화
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

// 카메라에 모션인식
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

      poseLandmarker.detectForVideo(webcam, startTimeMs, async (result) => {
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

          // // 스티커 생성
          // const stickerCanvas = await faceSticker(landmark[7], landmark[8]);
          // // 캔버스를 HTML 문서에 추가
          // const currNode = document.getElementById("webcam");
          // const parentNode = currNode?.parentElement; // 부모 노드 가져오기
          // if (parentNode) {
          //   // console.log("C");
          //   parentNode.insertBefore(stickerCanvas, currNode?.nextSibling); // 캔버스 삽입
          // }

          // const stickerCtx = stickerCanvas.getContext("2d");
          // stickerCtx.drawImage(stickerImage, 0, 0, canvas.width, canvas.height);
          if (landmark[7].visibility > 0.5) {
            await faceSticker(landmark[7], landmark[8]);
          }
          // 캔버스에 스티커 그리기
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

// 스티커 이미지 생성
const stickerImage = new Image();
stickerImage.src = sticker1; // 스티커 이미지 경로
stickerImage.id = "sticker";
await new Promise((resolve) => {
  stickerImage.onload = resolve; // 이미지 로드 완료 시 resolve 호출
});

// 얼굴 좌표 받아서 스티커 붙이기

let camSize: DOMRect | null = null;

// export async function faceSticker(
//   leftEarLandmark: NormalizedLandmark,
//   rightEarLandmark: NormalizedLandmark
// ) {
//   let leftX = -1;
//   let rightX = -1;
//   let leftY = -1;
//   let earDist = -1;
//   if (camSize) {
//     leftX = leftEarLandmark.x * camSize.width;
//     rightX = rightEarLandmark.x * camSize.width;
//     leftY = leftEarLandmark.y * camSize.height;
//     earDist = Math.abs(rightX - leftX);
//   }

//   const imageLeft = `${leftX}px`;
//   const imageTop = `${leftY - earDist / 2}px`;

//   let img: HTMLImageElement | null = null;
//   img = document.getElementById("sticker") as HTMLImageElement;
//   const friendNode = document.getElementById("webcam");
//   const parentNode = friendNode?.parentElement;
//   if (!img) {
//     img = stickerImage;
//     if (friendNode && parentNode)
//       parentNode.insertBefore(img, friendNode.nextSibling);
//     img.style.position = "absolute";
//   }
//   img.style.left = imageLeft;
//   img.style.top = imageTop;
//   img.width = earDist;
//   img.height = earDist;
//   img.style.transform = "1";
// }

export async function faceSticker(
  leftEarLandmark: NormalizedLandmark,
  rightEarLandmark: NormalizedLandmark
) {
  let leftX = -1;
  let rightX = -1;
  let leftY = -1;
  let rightY = -1;
  let earDist = -1;

  if (camSize) {
    leftX = makeAbsoluteLandmarkX(1 - leftEarLandmark.x);
    rightX = makeAbsoluteLandmarkX(1 - rightEarLandmark.x);
    leftY = makeAbsoluteLandmarkY(leftEarLandmark.y); // 여기서 Y는 귀의 위치를 기준으로 계산
    rightY = makeAbsoluteLandmarkY(leftEarLandmark.y);
    earDist = Math.max(Math.abs(leftX - rightX), Math.abs(leftY - rightY));
    console.log(leftX);
  }

  const stickerSize = earDist * 2.5; // 스티커 크기를 조정
  const imageLeft = `${leftX - stickerSize / 4}px`;
  const imageTop = `${leftY - stickerSize / 2}px`;

  let img = document.getElementById("sticker") as HTMLImageElement;
  if (!img) {
    img = document.createElement("img");
    img.src = sticker1; // 스티커 이미지 경로
    img.id = "sticker";
    document.body.appendChild(img);
    img.style.position = "absolute";
    // img.style.zIndex = "99";
  }
  img.style.left = imageLeft;
  img.style.top = imageTop;
  img.width = stickerSize;
  img.height = stickerSize;
}

// 상대 좌표 절대 좌표로 변환 - X
function makeAbsoluteLandmarkX(relativeX: number): number {
  // 상대적인 위치를 픽셀 단위로 변환
  // console.log(camSize);
  if (domSize) return domSize.left + relativeX * domSize?.width;
  return -1;
}

// 상대 좌표 절대 좌표로 변환 - Y
function makeAbsoluteLandmarkY(relativeY: number): number {
  // 상대적인 위치를 픽셀 단위로 변환
  if (domSize) return relativeY * domSize?.height;
  return -1;
}

// 해당하는 아이디를 가진 컴포넌트 위치 찾기
export function btnPlace(id: string): DOMRect | undefined {
  const btnElement = document.getElementById(id);
  const btnRect = btnElement?.getBoundingClientRect();
  console.log(`${id} 요소:`, btnRect);
  return btnRect;
}

// 버튼 컴포넌트의 기본 정보 가져오기
export function setBtnInfo() {
  const webcam = btnPlace("webcam");
  const dom = btnPlace("dom");
  const visibleBtn = btnPlace("visible");
  const timerBtn = btnPlace("timer");
  const recordBtn = btnPlace("record");
  const saveBtn = btnPlace("save");
  const rsltBtn = btnPlace("rslt");

  if (webcam) useDomStore.getState().setCamSize(webcam);
  if (dom) useDomStore.getState().setDomSize(dom);
  if (visibleBtn) useDomStore.getState().setVisibleBtnSize(visibleBtn);
  if (timerBtn) useDomStore.getState().setTimeBtnSize(timerBtn);
  if (recordBtn) useDomStore.getState().setRecordBtnSize(recordBtn);
  if (saveBtn) useDomStore.getState().setSaveBtnSize(saveBtn);
  if (rsltBtn) useDomStore.getState().setRsltBtnSize(rsltBtn);

  camSize = useDomStore.getState().domSize;
  domSize = useDomStore.getState().domSize;
  visibleBtnSize = useDomStore.getState().visibleBtnSize;
  timerBtnSize = useDomStore.getState().timerBtnSize;
  recorderBtnSize = useDomStore.getState().recordBtnSize;
  saveBtnSize = useDomStore.getState().saveBtnSize;
  modeBtnSize = useDomStore.getState().modeBtnSize;
  rsltBtnSize = useDomStore.getState().rsltBtnSize;
}
