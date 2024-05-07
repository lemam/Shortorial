import { NormalizedLandmark } from "@mediapipe/tasks-vision";

// 좌우 모션 인식에 활용되는 변수
let left_count = 0;
let right_count = 0;

// 우측 상단에 접근하면 우측상단! 반환
export function btn_with_landmark(handLandmarker: NormalizedLandmark) {
  if (
    handLandmarker.x < 0.2 &&
    handLandmarker.y < 0.2 &&
    handLandmarker.visibility > 0.5
  ) {
    console.log("우측 상단!");
  } else {
    console.log("아니지렁");
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
        if (left_count > 10) console.log("왼쪽");
      } else if (before_handLandmarker.x - curr_handmarker.x > 0) {
        left_count = 0;
        right_count++;
        if (right_count > 10) console.log("오른쪽");
      } else {
        left_count = right_count = 0;
      }
    }
  }
}
