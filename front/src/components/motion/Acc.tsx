import { NormalizedLandmark } from "@mediapipe/tasks-vision";

export function Acc(
  videoLandmark: NormalizedLandmark[],
  camLandmark: NormalizedLandmark[]
): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < videoLandmark.length; i++) {
    const video = videoLandmark[i];
    const cam = camLandmark[i];

    dotProduct += video.x * cam.x + video.y * cam.y + video.z * cam.z;
    normA += Math.sqrt(video.x ** 2 + video.y ** 2 + video.z ** 2);
    normB += Math.sqrt(cam.x ** 2 + cam.y ** 2 + cam.z ** 2);
  }

  const similarity = dotProduct / (normA * normB);
  console.log(similarity);
  return similarity;
}
