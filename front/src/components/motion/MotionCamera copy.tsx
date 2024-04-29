import React, { useEffect } from 'react';
import { Camera } from "@mediapipe/camera_utils";
import { Pose, Landmark, Results, POSE_CONNECTIONS } from "@mediapipe/pose";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

export default function MotionCamera2() {
  useEffect(() => {
    const videoElement = document.getElementById('videoElement') as HTMLVideoElement;
    const canvasElement = document.getElementById('canvasElement') as HTMLCanvasElement;
    if (!videoElement || !canvasElement) {
      console.error("Required elements (video or canvas) not found");
      return;
    }

    const canvasCtx = canvasElement.getContext('2d');
    let referencePose: Landmark[] | null = null;

    const pose = new Pose({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    })
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    pose.onResults(onResults);

    function onResults(results: Results) {
      if (!canvasCtx) return;
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

      if (results.poseLandmarks) {
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {color: '#00FF00', lineWidth: 4});
        drawLandmarks(canvasCtx, results.poseLandmarks, {color: '#FF0000', lineWidth: 2});

        if (!referencePose) {
          referencePose = results.poseLandmarks;
          console.log("Reference pose set!");
        } else {
          const similarityScore = calculateSimilarity(referencePose, results.poseLandmarks);
          console.log(`Similarity Score: ${similarityScore}`);
        }
      }
      canvasCtx.restore();
    }

    function calculateSimilarity(refPose: Landmark[], newPose: Landmark[]): number {
      return refPose.reduce((score, refPoint, index) => {
        const newPoint = newPose[index];
        return score + Math.sqrt(
          (refPoint.x - newPoint.x) ** 2 +
          (refPoint.y - newPoint.y) ** 2 +
          (refPoint.z - newPoint.z) ** 2
        );
      }, 0);
    }

    const connectCamera = () => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          videoElement.srcObject = stream;
          videoElement.play();
        })
        .catch(error => {
          console.error('Camera access failed:', error);
        });
    };

    connectCamera();

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await pose.send({ image: videoElement });
      },
      width: 640,
      height: 480
    });

    camera.start();

    return () => {
      camera.stop();
      if (videoElement.srcObject) {
        (videoElement.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <video id="videoElement" style={{ display: 'none' }} autoPlay playsInline />
      <canvas id="canvasElement" />
    </div>
  );
}