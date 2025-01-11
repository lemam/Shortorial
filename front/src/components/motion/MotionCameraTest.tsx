import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import { useCallback, useEffect, useRef, useState } from "react";

function MotionCameraTest() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [userPermission, setUserPermission] = useState<boolean>(true);
  const [poseLandmarker, setPoseLandmarker] = useState<PoseLandmarker | null>(null);

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
  }, []);

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
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        if (results.landmarks) {
          results.landmarks.forEach(landmark => {
            landmark.forEach(point => {
              ctx.beginPath();
              ctx.arc(point.x * canvas.width, point.y * canvas.height, 5, 0, 2 * Math.PI);
              ctx.fillStyle = "red";
              ctx.fill();
            });
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
  }, [poseLandmarker]);

  return (
    <div>
      {!userPermission && (
        <div>카메라 접근이 차단되었습니다. 상단 아이콘을 클릭하여 접근을 허용 후 새로고침해주세요.</div>
      )}
      <video ref={videoRef} autoPlay playsInline></video>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default MotionCameraTest;
