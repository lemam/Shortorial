import { NormalizedLandmark } from "@mediapipe/tasks-vision";

const POINTS: number[][] = [
  [11, 13],
  [13, 15],
  [10, 12],
  [14, 16],
  [24, 26],
  [26, 28],
  [23, 25],
  [25, 27],
];

interface mark {
  x: number;
  y: number;
  z: number;
}
export function Acc(
  videoLandmark: NormalizedLandmark[],
  camLandmark: NormalizedLandmark[]
) {
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
