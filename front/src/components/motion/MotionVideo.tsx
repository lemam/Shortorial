import { useEffect, useRef } from "react";
import styled from "styled-components";
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils,
  NormalizedLandmark,
} from "@mediapipe/tasks-vision";

import sampleVideo from "../../assets/sample.mp4";

interface VideoType {
  width: number;
  height: number;
  getLandmark: (landmarkData: NormalizedLandmark[]) => void;
}

const MAX_COUNT: number = 2;

export default function MotionVideo({ width, height, getLandmark }: VideoType) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let videoRunning = true;
    let cnt = 0;
    let sumLandmark: NormalizedLandmark[] | null = null;
    // 비디오 재생 상태를 감시하는 이벤트 리스너 추가
    const handlePlay = () => {
      videoRunning = true;
      // if (canvasElement) canvasElement.style.display = "block";
      // if (canvasElementTest) canvasElementTest.style.display = "none";
      predictVideo();
    };

    const handlePause = () => {
      // if (canvasElement) canvasElement.style.display = "none";
      videoRunning = false;
    };

    videoRef.current?.addEventListener("play", handlePlay);
    videoRef.current?.addEventListener("pause", handlePause);

    // poseLandmarker instance를 저장할 변수
    let poseLandmarker: PoseLandmarker | null = null;

    // PoseLandmarker 인스턴스 초기화
    const createPoseLandmarker = async () => {
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

    // 그림 그리기 초기화
    createPoseLandmarker();

    const video = document.getElementById("video") as HTMLVideoElement | null;
    // const canvasElement = document.getElementById(
    //   "video_canvas"
    // ) as HTMLCanvasElement | null;
    // let canvasCtx: CanvasRenderingContext2D | null = null;
    // let drawingUtils: DrawingUtils | null = null;

    // if (canvasElement) canvasCtx = canvasElement.getContext("2d");
    // if (canvasCtx) drawingUtils = new DrawingUtils(canvasCtx);

    // let canvasElementTest = document.getElementById(
    //   "test_canvas"
    // ) as HTMLCanvasElement | null;
    // let canvasCtxTest: CanvasRenderingContext2D | null = null;
    // let drawingUtilsTest: DrawingUtils | null = null;

    // if (canvasElementTest) canvasCtxTest = canvasElementTest.getContext("2d");
    // if (canvasCtxTest) drawingUtilsTest = new DrawingUtils(canvasCtxTest);

    let lastVideoTime = -1;
    async function predictVideo() {
      // if (!canvasElement) return null;
      if (!video || !poseLandmarker) return null;

      let startTimeMs = performance.now();
      if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
          // if (!canvasCtx || !drawingUtils) return null;
          // if (!canvasCtxTest || !drawingUtilsTest || !canvasElementTest)
          //   return null;

          // canvasCtx.save();
          // canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

          for (const landmark of result.landmarks) {
            if (cnt == 0) {
              sumLandmark = [...landmark];
            } else {
              if (sumLandmark) {
                for (let idx = 0; idx < landmark.length; idx++) {
                  sumLandmark[idx].x += landmark[idx].x;
                  sumLandmark[idx].y += landmark[idx].y;
                  sumLandmark[idx].z += landmark[idx].z;
                }
              }
            }
            if (cnt === MAX_COUNT && sumLandmark) {
              // canvasCtxTest.clearRect(
              //   0,
              //   0,
              //   canvasElementTest.width,
              //   canvasElementTest.height
              // );
              // for (const landmark of sumLandmark) {
              //   landmark.x /= cnt + 1; // 랜드마크의 개수로 나누어 평균을 계산
              //   landmark.y /= cnt + 1;
              //   landmark.z /= cnt + 1;
              // }
              // getLandmark(sumLandmark);
              // drawingUtilsTest.drawLandmarks(sumLandmark, {
              //   radius: (data: any) =>
              //     DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1),
              // });
              // drawingUtilsTest.drawConnectors(
              //   sumLandmark,
              //   PoseLandmarker.POSE_CONNECTIONS
              // );
              // canvasCtxTest.restore();
            }
            getLandmark(landmark);

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

      if (videoRunning === true) {
        if (cnt > MAX_COUNT) {
          // console.log(cnt);
          // console.log(sumLandmark);
          // console.log("============================");
          cnt = 0;
        } else {
          cnt++;
        }
        window.requestAnimationFrame(predictVideo);
      } else {
        // canvasElement.style.display = "none";
      }
    }

    predictVideo();
    setTimeout(() => {
      // videoRef.current 여기가 비디오 객체입니다.
      videoRef.current?.play();
    }, 3000);

    return () => {
      // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거
      videoRef.current?.removeEventListener("play", handlePlay);
      videoRef.current?.removeEventListener("pause", handlePause);
    };
  }, []);

  return (
    <Container>
      <video
        id="video"
        width={width}
        height={height}
        style={{ objectFit: "cover" }}
        ref={videoRef}
        src={sampleVideo}
        // autoPlay
        playsInline
      ></video>
      {/* <canvas
        id="video_canvas"
        width={width}
        height={height}
        style={{ objectFit: "cover" }}
      ></canvas>
      <canvas
        id="test_canvas"
        width={width}
        height={height}
        style={{ objectFit: "cover", background: "grey", display: "none" }}
      ></canvas> */}
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
