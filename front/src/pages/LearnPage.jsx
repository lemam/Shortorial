import { useCallback, useEffect, useRef } from "react";
import danceVideo from "../assets/sample.mp4";

export default function LearnPage() {
  const cameraRef = useRef();

  // 카메라 생성
  const setCamera = useCallback(() => {
    // 미디어 설정
    const constraints = {
      video: {
        aspectRatio: 9 / 16,
        facingMode: "user", // 전면 카메라 사용
      },
      audio: false,
    };

    // 카메라 권한 요청
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (cameraRef.current) cameraRef.current.srcObject = stream;
      })
      .catch((error) => {
        alert("카메라 권한을 찾을 수 없습니다.");
        console.error("Media device access error:", error);
      });
  }, []);

  useEffect(() => {
    setCamera();
  }, [setCamera]);

  return (
    <div>
      <video
        src={danceVideo}
        controls
        style={{ width: "100%", height: "100%" }}
      ></video>
      <video id="userCamera" ref={cameraRef} autoPlay playsInline></video>
    </div>
  );
}
