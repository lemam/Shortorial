import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { ElevatorSharp } from "@mui/icons-material";

let left_count = 0;
let right_count = 0;
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
