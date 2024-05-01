import { useCallback, useEffect, useRef } from "react";

const Camera = () => {
  const cameraRef = useRef<HTMLVideoElement>(null);

  // 카메라 설정 초기화
  const initCamera = useCallback(() => {
    // 미디어 설정
    const constraints: MediaStreamConstraints = {
      video: {
        aspectRatio: 9 / 16,
        facingMode: "user", // 전면 카메라 사용
      },
      audio: false,
    };

    // 카메라 권한 요청
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream: MediaStream) => {
        if (cameraRef.current) cameraRef.current.srcObject = stream;
      })
      .catch((error: Error) => {
        alert("카메라 권한을 찾을 수 없습니다.");
        console.error("Media device access error:", error);
      });
  }, []);

  useEffect(() => {
    initCamera();
  });

  return <video ref={cameraRef} autoPlay></video>;
};

export default Camera;
