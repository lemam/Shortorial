import { NormalizedLandmark } from "@mediapipe/tasks-vision";

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
