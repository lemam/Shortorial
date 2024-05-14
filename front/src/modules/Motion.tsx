import {
  PoseLandmarker,
  NormalizedLandmark,
  DrawingUtils,
  FilesetResolver,
} from "@mediapipe/tasks-vision";
import { useDomStore, useMotionDetectionStore } from "../store/useMotionStore";

// 버튼 모션에 활용되는 함수
let visible_count = 0;
let timer_count = 0;
let record_count = 0;
let save_count = 0;
let learn_count = 0;
let rslt_count = 0;

let play_count = 0;
let challenge_count = 0;
let repeat_count = 0;
let flip_count = 0;
let speed_count = 0;

let domSize: DOMRect | null = null;
let visibleBtnSize: DOMRect | null = null;
let timerBtnSize: DOMRect | null = null;
let recorderBtnSize: DOMRect | null = null;
let saveBtnSize: DOMRect | null = null;
let learnBtnSize: DOMRect | null = null;
let rsltBtnSize: DOMRect | null = null;

let playSize: DOMRect | null = null;
let challengeSize: DOMRect | null = null;
let repeatSize: DOMRect | null = null;
let flipSize: DOMRect | null = null;
let speedSize: DOMRect | null = null;

// 좌우 모션 인식에 활용되는 변수
let left_count = 0;
let right_count = 0;
let poseLandmarker: PoseLandmarker | null = null;

const SMALL_COUNT: number = 10;
// const MED_COUNT: number = 15;
// const MAX_COUNT: number = 30;

// 챌린지 모드 버튼누르기
export function btn_with_landmark_challenge(
  handLandmarker: NormalizedLandmark,
  setBtn: (newBtn: string) => void
) {
  // console.log(handLandmarkerX);
  const handLandmarkerX = makeAbsoluteLandmarkX(handLandmarker.x);
  const handLandmarkerY = makeAbsoluteLandmarkY(handLandmarker.y);
  // if (handLandmarker.visibility > 0.5) {
  //   console.log("X : ", handLandmarker.x);
  //   console.log("Y : ", handLandmarker.y);
  // }

  if (
    visibleBtnSize &&
    handLandmarkerX <= visibleBtnSize.right &&
    handLandmarkerX >= visibleBtnSize.left &&
    handLandmarker.visibility > 0.5
  ) {
    if (
      handLandmarkerY >= visibleBtnSize.top &&
      handLandmarkerY <= visibleBtnSize.bottom
    ) {
      if (visible_count >= SMALL_COUNT) {
        setBtn("visible");
      } else {
        visible_count++;
        useMotionDetectionStore
          .getState()
          .setVisibleCount((visible_count / SMALL_COUNT) * 100);
        timer_count = 0;
        useMotionDetectionStore.getState().setTimerCount(0);
        record_count = 0;
        useMotionDetectionStore.getState().setRecordCount(0);
        save_count = 0;
        learn_count = 0;
        useMotionDetectionStore.getState().setLearnCount(0);
        rslt_count = 0;
        useMotionDetectionStore.getState().setResultCount(0);
      }
    } else if (
      timerBtnSize &&
      handLandmarkerY >= timerBtnSize.top &&
      handLandmarkerY <= timerBtnSize.bottom
    ) {
      if (timer_count >= SMALL_COUNT) {
        setBtn("timer");
      } else {
        setBtn("none");
        visible_count = 0;
        useMotionDetectionStore.getState().setVisibleCount(0);
        timer_count++;
        useMotionDetectionStore
          .getState()
          .setTimerCount((timer_count / SMALL_COUNT) * 100);
        record_count = 0;
        useMotionDetectionStore.getState().setRecordCount(0);
        save_count = 0;
        learn_count = 0;
        useMotionDetectionStore.getState().setLearnCount(0);
        rslt_count = 0;
        useMotionDetectionStore.getState().setResultCount(0);
      }
    } else if (
      recorderBtnSize &&
      handLandmarkerY >= recorderBtnSize.top &&
      handLandmarkerY <= recorderBtnSize.bottom
    ) {
      if (record_count >= SMALL_COUNT) {
        setBtn("record");
      } else {
        setBtn("none");
        visible_count = 0;
        useMotionDetectionStore.getState().setVisibleCount(0);
        timer_count = 0;
        useMotionDetectionStore.getState().setTimerCount(0);
        record_count++;
        useMotionDetectionStore
          .getState()
          .setRecordCount((record_count / SMALL_COUNT) * 100);
        save_count = 0;
        learn_count = 0;
        useMotionDetectionStore.getState().setLearnCount(0);
        rslt_count = 0;
        useMotionDetectionStore.getState().setResultCount(0);
      }
    } else if (
      saveBtnSize &&
      handLandmarkerY >= saveBtnSize.top &&
      handLandmarkerY <= saveBtnSize.bottom
    ) {
      if (save_count >= SMALL_COUNT) {
        setBtn("save");
      } else {
        setBtn("none");
        visible_count = 0;
        timer_count = 0;
        record_count = 0;
        save_count++;
        learn_count = 0;
        rslt_count = 0;
      }
    } else if (
      learnBtnSize &&
      handLandmarkerY >= learnBtnSize.top &&
      handLandmarkerY <= learnBtnSize.bottom
    ) {
      if (learn_count >= SMALL_COUNT) {
        setBtn("learn");
      } else {
        setBtn("none");
        visible_count = 0;
        useMotionDetectionStore.getState().setVisibleCount(0);
        timer_count = 0;
        useMotionDetectionStore.getState().setTimerCount(0);
        record_count = 0;
        useMotionDetectionStore.getState().setRecordCount(0);
        save_count = 0;
        learn_count++;
        useMotionDetectionStore
          .getState()
          .setLearnCount((learn_count / SMALL_COUNT) * 100);
        rslt_count = 0;
        useMotionDetectionStore.getState().setResultCount(0);
      }
    } else if (
      rsltBtnSize &&
      handLandmarkerY >= rsltBtnSize.top &&
      handLandmarkerY <= rsltBtnSize.bottom
    ) {
      if (rslt_count == SMALL_COUNT) {
        setBtn("rslt");
      } else {
        setBtn("none");
        visible_count = 0;
        useMotionDetectionStore.getState().setVisibleCount(0);
        timer_count = 0;
        useMotionDetectionStore.getState().setTimerCount(0);
        record_count = 0;
        useMotionDetectionStore.getState().setRecordCount(0);
        save_count = 0;
        learn_count = 0;
        useMotionDetectionStore.getState().setLearnCount(0);
        rslt_count++;
        useMotionDetectionStore
          .getState()
          .setResultCount((rslt_count / SMALL_COUNT) * 100);
      }
    }
  } else {
    setBtn("none");
    visible_count = 0;
    useMotionDetectionStore.getState().setVisibleCount(0);
    timer_count = 0;
    useMotionDetectionStore.getState().setTimerCount(0);
    record_count = 0;
    useMotionDetectionStore.getState().setRecordCount(0);
    save_count = 0;
    learn_count = 0;
    useMotionDetectionStore.getState().setLearnCount(0);
    rslt_count = 0;
    useMotionDetectionStore.getState().setResultCount(0);
  }
}

// 연습 모드 버튼 누르기
function btn_with_landmark_learn(
  handLandmarker: NormalizedLandmark,
  setBtn: (newBtn: string) => void
) {
  // 절대 좌표로 변경
  const handLandmarkerX = makeAbsoluteLandmarkX(handLandmarker.x);
  const handLandmarkerY = makeAbsoluteLandmarkY(handLandmarker.y);
  if (
    playSize &&
    handLandmarkerX <= playSize.right &&
    handLandmarkerX >= playSize.left &&
    handLandmarker.visibility > 0.5
  ) {
    if (handLandmarkerY >= playSize.top && handLandmarkerY <= playSize.bottom) {
      if (play_count >= SMALL_COUNT) {
        setBtn("play");
      } else {
        // console.log("B");
        setBtn("none");
        play_count++;
        useMotionDetectionStore
          .getState()
          .setPlayCount((play_count / SMALL_COUNT) * 100);
        challenge_count = 0;
        useMotionDetectionStore.getState().setChallengeCount(0);
        repeat_count = 0;
        useMotionDetectionStore.getState().setRepeatCount(0);
        flip_count = 0;
        useMotionDetectionStore.getState().setFlipCount(0);
        speed_count = 0;
        useMotionDetectionStore.getState().setSpeedCount(0);
      }
    } else if (
      challengeSize &&
      handLandmarkerY >= challengeSize.top &&
      handLandmarkerY <= challengeSize.bottom
    ) {
      if (challenge_count >= SMALL_COUNT) {
        setBtn("challenge");
      } else {
        setBtn("none");
        play_count = 0;
        useMotionDetectionStore.getState().setPlayCount(0);
        challenge_count++;
        useMotionDetectionStore
          .getState()
          .setChallengeCount((challenge_count / SMALL_COUNT) * 100);
        repeat_count = 0;
        useMotionDetectionStore.getState().setRepeatCount(0);
        flip_count = 0;
        useMotionDetectionStore.getState().setFlipCount(0);
        speed_count = 0;
        useMotionDetectionStore.getState().setSpeedCount(0);
      }
    } else if (
      repeatSize &&
      handLandmarkerY >= repeatSize.top &&
      handLandmarkerY <= repeatSize.bottom
    ) {
      if (repeat_count >= SMALL_COUNT) {
        setBtn("repeat");
      } else {
        setBtn("none");
        play_count = 0;
        useMotionDetectionStore.getState().setPlayCount(0);
        challenge_count = 0;
        useMotionDetectionStore.getState().setChallengeCount(0);
        repeat_count++;
        useMotionDetectionStore
          .getState()
          .setRepeatCount((repeat_count / SMALL_COUNT) * 100);
        flip_count = 0;
        useMotionDetectionStore.getState().setFlipCount(0);
        speed_count = 0;
        useMotionDetectionStore.getState().setSpeedCount(0);
      }
    } else if (
      flipSize &&
      handLandmarkerY >= flipSize.top &&
      handLandmarkerY <= flipSize.bottom
    ) {
      if (flip_count >= SMALL_COUNT) {
        setBtn("flip");
      } else {
        setBtn("none");
        play_count = 0;
        useMotionDetectionStore.getState().setPlayCount(0);
        challenge_count = 0;
        useMotionDetectionStore.getState().setChallengeCount(0);
        repeat_count = 0;
        useMotionDetectionStore.getState().setRepeatCount(0);
        flip_count++;
        useMotionDetectionStore
          .getState()
          .setFlipCount((flip_count / SMALL_COUNT) * 100);
        speed_count = 0;
        useMotionDetectionStore.getState().setSpeedCount(0);
      }
    } else if (
      speedSize &&
      handLandmarkerY >= speedSize.top &&
      handLandmarkerY <= speedSize.bottom
    ) {
      if (speed_count >= SMALL_COUNT) {
        setBtn("speed");
      } else {
        setBtn("none");
        play_count = 0;
        useMotionDetectionStore.getState().setPlayCount(0);
        challenge_count = 0;
        useMotionDetectionStore.getState().setChallengeCount(0);
        repeat_count = 0;
        useMotionDetectionStore.getState().setRepeatCount(0);
        flip_count = 0;
        useMotionDetectionStore.getState().setFlipCount(0);
        speed_count++;
        useMotionDetectionStore
          .getState()
          .setSpeedCount((speed_count / SMALL_COUNT) * 100);
      }
    }
  } else {
    setBtn("none");
    play_count = 0;
    useMotionDetectionStore.getState().setPlayCount(0);
    challenge_count = 0;
    useMotionDetectionStore.getState().setChallengeCount(0);
    repeat_count = 0;
    useMotionDetectionStore.getState().setRepeatCount(0);
    flip_count = 0;
    useMotionDetectionStore.getState().setFlipCount(0);
    speed_count = 0;
    useMotionDetectionStore.getState().setSpeedCount(0);
  }
}

// 손 움직이면 좌우 인식
function action_with_landmark(
  before_handLandmarker: NormalizedLandmark,
  curr_handmarker: NormalizedLandmark,
  minY: number,
  maxY: number,
  setAction: (newAction: string) => void
) {
  if (
    before_handLandmarker.visibility > 0.5 &&
    curr_handmarker.visibility > 0.5
  ) {
    if (
      before_handLandmarker.y > minY &&
      before_handLandmarker.y < maxY &&
      curr_handmarker.y > 0.3 &&
      curr_handmarker.y < 0.8
    ) {
      if (before_handLandmarker.x - curr_handmarker.x < 0) {
        right_count = 0;
        left_count++;
        if (left_count > 5) {
          console.log("next");
          setAction("next");
          setTimeout(() => {
            setAction("none");
            left_count = 0;
            right_count = 0;
          }, 1500);
        }
      } else if (before_handLandmarker.x - curr_handmarker.x > 0) {
        left_count = 0;
        right_count++;
        if (right_count > 5) {
          console.log("prev");
          setAction("prev");
          setTimeout(() => {
            setAction("none");
            left_count = 0;
            right_count = 0;
          }, 1500);
        }
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
  cate: string,
  webcam: HTMLVideoElement | null,
  canvasCtx: CanvasRenderingContext2D | null,
  canvasElement: HTMLCanvasElement | null,
  drawingUtils: DrawingUtils | null,
  lastWebcamTime: number,
  before_handmarker: NormalizedLandmark | null,
  curr_handmarker: NormalizedLandmark | null,
  setBtn: (newBtn: string) => void,
  setAction?: (newAction: string) => void
) {
  // console.log("loading...s");
  if (webcam && poseLandmarker) {
    // console.log("Start");
    const startTimeMs = performance.now();
    if (lastWebcamTime !== webcam.currentTime) {
      // console.log("Test");
      lastWebcamTime = webcam.currentTime;

      poseLandmarker.detectForVideo(webcam, startTimeMs, (result) => {
        // if (!canvasCtx || !drawingUtils || !canvasElement) return null;
        // canvasCtx.save();
        // canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        for (const landmark of result.landmarks) {
          // 오른손이 우측 상단에 가면 알려주는 함수
          if (cate == "challenge")
            btn_with_landmark_challenge(landmark[18], setBtn);
          else btn_with_landmark_learn(landmark[18], setBtn);

          if (!before_handmarker) {
            if (landmark[18].visibility > 0.5) {
              before_handmarker = landmark[18];
              console.log("설정완");
            }
          } else {
            curr_handmarker = landmark[18];
            const minY = landmark[11].y;
            const maxY = (landmark[23].y + landmark[11].y) / 2;
            if (setAction)
              action_with_landmark(
                before_handmarker,
                curr_handmarker,
                minY,
                maxY,
                setAction
              );
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
      cate,
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

function makeAbsoluteLandmarkX(relativeX: number): number {
  // 상대적인 위치를 픽셀 단위로 변환
  if (domSize) {
    // console.log(domSize.left + (1 - relativeX) * domSize?.width);
    // console.log("A " + visibleBtnSize?.right);
    return domSize.left + (1 - relativeX) * domSize?.width;
  }
  return -1;
}

function makeAbsoluteLandmarkY(relativeY: number): number {
  // 상대적인 위치를 픽셀 단위로 변환
  if (domSize) return relativeY * domSize?.height;
  return -1;
}

function btnPlace(id: string): DOMRect | undefined {
  const btnElement = document.getElementById(id);
  const btnRect = btnElement?.getBoundingClientRect();
  console.log(`${id} 요소:`, btnRect);
  return btnRect;
}

export function setBtnInfo() {
  const dom = btnPlace("dom");
  const visibleBtn = btnPlace("visible");
  const timerBtn = btnPlace("timer");
  const recordBtn = btnPlace("record");
  const saveBtn = btnPlace("save");
  const learnBtn = btnPlace("learn");
  const rsltBtn = btnPlace("rslt");

  const play = btnPlace("play");
  const challenge = btnPlace("challenge");
  const repeat = btnPlace("repeat");
  const flip = btnPlace("flip");
  const speed = btnPlace("speed");

  if (dom) useDomStore.getState().setDomSize(dom);
  if (visibleBtn) useDomStore.getState().setVisibleBtnSize(visibleBtn);
  if (timerBtn) useDomStore.getState().setTimeBtnSize(timerBtn);
  if (recordBtn) useDomStore.getState().setRecordBtnSize(recordBtn);
  if (saveBtn) useDomStore.getState().setSaveBtnSize(saveBtn);
  if (learnBtn) useDomStore.getState().setLearnBtnSize(learnBtn);
  if (rsltBtn) useDomStore.getState().setRsltBtnSize(rsltBtn);

  if (play) useDomStore.getState().setPlaySize(play);
  if (challenge) useDomStore.getState().setChallengeSize(challenge);
  if (repeat) useDomStore.getState().setRepeatSize(repeat);
  if (flip) useDomStore.getState().setFlipSize(flip);
  if (speed) useDomStore.getState().setSpeedSize(speed);

  domSize = useDomStore.getState().domSize;
  visibleBtnSize = useDomStore.getState().visibleBtnSize;
  timerBtnSize = useDomStore.getState().timerBtnSize;
  recorderBtnSize = useDomStore.getState().recordBtnSize;
  saveBtnSize = useDomStore.getState().saveBtnSize;
  learnBtnSize = useDomStore.getState().learnBtnSize;
  rsltBtnSize = useDomStore.getState().rsltBtnSize;

  playSize = useDomStore.getState().playSize;
  challengeSize = useDomStore.getState().challengeSize;
  repeatSize = useDomStore.getState().repeatSize;
  flipSize = useDomStore.getState().flipSize;
  speedSize = useDomStore.getState().speedSize;
}
