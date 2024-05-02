import { NormalizedLandmark } from "@mediapipe/tasks-vision";

export function Acc(
  videoLandmark: NormalizedLandmark[],
  camLandmark: NormalizedLandmark[]
) {
  const angleDifferences: number[] = [];
  for (let i = 0; i < videoLandmark.length; i++) {
    const angleDiff = calculateDistance(videoLandmark[i], camLandmark[i]);
    angleDifferences.push(angleDiff);
  }

  // 각 동작의 각도 차이를 종합하여 유사도를 계산합니다.
  // 여기서는 각 동작의 각도 차이의 평균을 사용합니다.
  const meanAngleDifference =
    angleDifferences.reduce((acc, curr) => acc + curr, 0) /
    angleDifferences.length;

  // 유사도는 1에서 평균 각도 차이를 뺀 값으로 정의합니다.
  // 더 낮은 각도 차이는 더 높은 유사도를 나타냅니다.
  const similarity = 1 - meanAngleDifference;

  return similarity;
}

function calculateDistance(
  video: NormalizedLandmark,
  cam: NormalizedLandmark
): number {
  const dx = video.x - cam.x;
  const dy = video.y - cam.y;
  const dz = video.z - cam.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
