import { NormalizedLandmark } from "@mediapipe/tasks-vision";

const POINTS: number[][] = [
  [8, 12],
  [7, 11],
  [8, 7],
  [12, 14],
  [16, 14],
  [16, 20],
  [16, 18],
  [11, 13],
  [13, 15],
  [15, 19],
  [15, 17],
  [12, 11],
  [12, 24],
  [11, 23],
  [24, 23],
  [24, 26],
  [26, 28],
  [28, 32],
  [28, 30],
  [23, 25],
  [25, 27],
  [27, 29],
  [27, 31],
];

interface mark {
  x: number;
  y: number;
  z: number;
}
export async function Acc(
  videoLandmarkOrigin: NormalizedLandmark[],
  camLandmarkOrigin: NormalizedLandmark[]
) {
  const videoLandmark = normalizePoseScale(videoLandmarkOrigin);
  const camLandmark = normalizePoseScale(camLandmarkOrigin);
  let sum = 0;
  let pose1ConfidenceSum = 0;

  POINTS.map((point) => {
    const v1 = {
      x: videoLandmark[point[0]].x - videoLandmark[point[1]].x,
      y: videoLandmark[point[0]].y - videoLandmark[point[1]].y,
      z: videoLandmark[point[0]].z! - videoLandmark[point[1]].z!,
    };
    const v2 = {
      x: camLandmark[point[0]].x - camLandmark[point[1]].x,
      y: camLandmark[point[0]].y - camLandmark[point[1]].y,
      z: camLandmark[point[0]].z! - camLandmark[point[1]].z!,
    };
    const pose1Confidence =
      (videoLandmark[point[0]].visibility! +
        videoLandmark[point[1]].visibility!) /
      2;
    const pose2Confidence =
      (camLandmark[point[0]].visibility! + camLandmark[point[1]].visibility!) /
      2;
    const diffConfidence = Math.abs(pose1Confidence - pose2Confidence);

    const norm_v1 = l2_norm(v1);
    const norm_v2 = l2_norm(v2);
    const tempSum =
      diffConfidence > 0.5
        ? 0
        : similarity(norm_v1, norm_v2) * (1 - diffConfidence);
    pose1ConfidenceSum += 1 - diffConfidence;
    sum += tempSum;

    return sum;
  });

  let avg = sum / pose1ConfidenceSum;
  if (avg < 0) avg = 0;
  return avg * 100;
}

const l2_norm = (kpt: mark) => {
  const norm = Math.sqrt(kpt.x * kpt.x + kpt.y * kpt.y + kpt.z * kpt.z);
  return { x: kpt.x / norm, y: kpt.y / norm, z: kpt.z / norm };
};

function similarity(vector1: mark, vector2: mark): number {
  // Dot product
  const dotProduct =
    vector1.x * vector2.x + vector1.y * vector2.y + vector1.z * vector2.z;

  // Magnitudes
  const magnitude1 = Math.sqrt(
    vector1.x * vector1.x + vector1.y * vector1.y + vector1.z * vector1.z
  );
  const magnitude2 = Math.sqrt(
    vector2.x * vector2.x + vector2.y * vector2.y + vector2.z * vector2.z
  );

  // Cosine similarity
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0; // Avoid division by zero
  } else {
    return dotProduct / (magnitude1 * magnitude2);
  }
}

// 포즈 데이터의 스케일을 정규화하는 함수
function normalizePoseScale(
  landmarks: NormalizedLandmark[]
): NormalizedLandmark[] {
  // 포즈의 중심점을 계산합니다 (여기서는 간단히 모든 점의 평균을 사용합니다)
  let centerX = 0;
  let centerY = 0;
  let centerZ = 0;
  landmarks.forEach((landmark) => {
    centerX += landmark.x;
    centerY += landmark.y;
    centerZ += landmark.z || 0; // z가 없는 경우를 대비하여 0을 사용할 수 있습니다
  });
  centerX /= landmarks.length;
  centerY /= landmarks.length;
  centerZ /= landmarks.length;

  // 모든 점을 중심점으로부터의 상대적 위치로 변환합니다
  const normalizedLandmarks = landmarks.map((landmark) => ({
    x: landmark.x - centerX,
    y: landmark.y - centerY,
    z: (landmark.z || 0) - centerZ,
    visibility: landmark.visibility,
  }));

  // 모든 점에 대한 최대 거리를 계산하여 모든 점을 이 거리로 나눕니다
  const maxDistance = normalizedLandmarks.reduce((max, { x, y, z }) => {
    const distance = Math.sqrt(x * x + y * y + z * z);
    return Math.max(max, distance);
  }, 0);

  return normalizedLandmarks.map(({ x, y, z, visibility }) => ({
    x: x / maxDistance,
    y: y / maxDistance,
    z: z / maxDistance,
    visibility: visibility,
  }));
}
