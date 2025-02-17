import { DrawingUtils, FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import { useCallback, useEffect, useRef, useState } from "react";
import useCameraStore from "./useCameraStore";
import styled from "styled-components";
import useMotionButtonStore from "../../store/useMotionButtonStore";
import { MotionButton } from "../../constants/types";

function MotionCameraTest() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [poseLandmarker, setPoseLandmarker] = useState<PoseLandmarker | null>(null);

  // 모션 버튼의 감지 관련 변수들
  const hoverStartTime = useRef(0);
  const hoveredButton = useRef<MotionButton | null>(null);

  // 모션 캡처의 부드러운 움직임을 위한 설정 값
  const lastPosition = useRef({ x: 0, y: 0 });
  const SMOOTHING_FACTOR = 0.8;

  const { setUserPermission } = useCameraStore();
  const { getButton } = useMotionButtonStore();

  // 포즈 랜드마크 초기화
  const createPoseLandmarker = async () => {
    // WASM 파일을 로드하여 Vision Tasks를 실행하기 위한 준비를 한다.
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );

    // 포즈 랜드마크 추정기 생성
    const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
        delegate: "GPU",
      },
      runningMode: "VIDEO", // 동영상에서 작업 실행
      numPoses: 1, // 감지할 수 있는 최대 포즈(사람) 수
    });

    console.log("랜드마크 초기화 완료");
    setPoseLandmarker(poseLandmarker);
  };

  // 카메라 접근 권한을 받은 후 video에 할당한다.
  const initCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { aspectRatio: 9 / 16 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.log("카메라 접근 실패:", error);
      setUserPermission(false);
    }
  }, [setUserPermission]);

  // 카메라, 포즈 랜드마크 초기화
  useEffect(() => {
    const video = videoRef.current;
    createPoseLandmarker();
    initCamera();

    return () => {
      // 컴포넌트가 언마운트되면 미디어 스트림 해제
      if (video && video.srcObject) {
        const tracks = (video.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [initCamera]);

  // 포즈 감지하고 캔버스에 출력
  useEffect(() => {
    if (!poseLandmarker || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const detectPose = async () => {
      if (!poseLandmarker || !video) return;

      // 캔버스 프레임 크기 설정
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // 포즈 감지
      const results = poseLandmarker.detectForVideo(video, performance.now());

      // 캔버스에 렌더링
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (results.landmarks) {
          const drawingUtils = new DrawingUtils(ctx);

          results.landmarks.forEach(landmark => {
            // 카메라 좌우반전에 따른 랜드마크 위치 재계산
            const flipLandmark = landmark.map(point => {
              const temp = { ...point };
              temp.x = 1 - temp.x;
              return temp;
            });

            // 오른쪽 새끼손가락 랜드마크를 기준으로 70% 이상 화면에 보이면
            if (flipLandmark[18].visibility >= 0.7) {
              // 손 랜드마크를 픽셀 단위 좌표로 변환
              // 노이즈를 줄이기 위한 이전 값을 이용한 평균 값
              const handX =
                SMOOTHING_FACTOR * lastPosition.current.x +
                (1 - SMOOTHING_FACTOR) * flipLandmark[18].x * canvas.offsetWidth;
              const handY =
                SMOOTHING_FACTOR * lastPosition.current.y +
                (1 - SMOOTHING_FACTOR) * flipLandmark[18].y * canvas.offsetHeight;

              lastPosition.current = { x: handX, y: handY };

              const button = getButton();

              // 손 위치가 버튼 안에 들어오면 활성화
              if (button) {
                if (handX >= button.minX && handX <= button.maxX && handY >= button.minY && handY <= button.maxY) {
                  // 들어온 버튼이란 걸 저장한다
                  if (hoveredButton.current !== button) {
                    hoveredButton.current = button;
                    hoverStartTime.current = Date.now();
                  }
                  // 3초 이상 지속
                  else if (hoverStartTime && Date.now() - hoverStartTime.current >= 3000) {
                    button.click();
                    hoverStartTime.current = 0;
                  }
                }
                // 아예 밖으로 나온 경우 초기화
                else {
                  hoveredButton.current = null;
                  hoverStartTime.current = 0;
                }
              }

              // 버튼이 여러 개인 경우
              // https://chatgpt.com/c/67a2fd48-4fe8-8004-8d40-fb3ac147caa0
              // const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
            }

            drawingUtils.drawLandmarks(flipLandmark, { radius: 5 });
            drawingUtils.drawConnectors(flipLandmark, PoseLandmarker.POSE_CONNECTIONS);
          });
        }
      }

      // 연속적으로 프레임을 업데이트
      requestAnimationFrame(detectPose);
    };

    video.addEventListener("loadeddata", detectPose);

    return () => {
      video.removeEventListener("loadeddata", detectPose);
    };
  }, [getButton, poseLandmarker]);

  return (
    <>
      <Camera ref={videoRef} autoPlay playsInline></Camera>
      <Canvas ref={canvasRef}></Canvas>
    </>
  );
}

const Camera = styled.video`
  width: 100%;
  transform: scaleX(-1);
`;

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;

export default MotionCameraTest;
