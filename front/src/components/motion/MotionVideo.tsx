import React, { useEffect } from "react";
import styled from "styled-components";
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

import sampleVideo from "../../assets/sample.mp4";

export default function MotionVideo() {
  useEffect(() => {
    // 동영상과 모션 인식 결과를 그릴 HTML 요소
    const videoElement = document.getElementById(
      "originVideo"
    ) as HTMLVideoElement | null;
    const canvasElement = document.getElementById(
      "output_canvas"
    ) as HTMLCanvasElement | null;
    let canvasCtx: CanvasRenderingContext2D | null = null;
    if (canvasElement) canvasCtx = canvasElement.getContext("2d");
    let drawingUtils: DrawingUtils | null = null;
    if (canvasCtx) drawingUtils = new DrawingUtils(canvasCtx);

    // PoseLandmarker 인스턴스 초기화
    let poseLandmarker: PoseLandmarker | null = null;
    const initPoseLandmarker = async () => {
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
      });
    };

    // 동영상 파일 불러오기 및 재생
    if (videoElement) {
      videoElement.src = sampleVideo;
      videoElement.play();
    }
  }, []);

  return (
    <Container>
      <video id="originVideo" controls></video>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: #000;
`;
