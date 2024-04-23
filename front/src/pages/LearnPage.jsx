import { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
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
    <LearnContainer>
      <VideoContainer>
        <video src={danceVideo} controls></video>
      </VideoContainer>
      <CameraContainer>
        <video id="userCamera" ref={cameraRef} autoPlay playsInline></video>
      </CameraContainer>
    </LearnContainer>
  );
}

const LearnContainer = styled.div`
  position: relative;
  height: 100vh;
  overflow: hidden;

  @media (orientation: portrait) {
    display: block;
    background-color: red;
  }

  @media (orientation: landscape) {
    display: flex;
    justify-content: center;
    background-color: blue;
  }
`;

const VideoContainer = styled.div`
  position: relative;
  height: 100%;

  @media (orientation: portrait) {
    video {
      width: 100%;
    }
  }

  @media (orientation: landscape) {
    video {
      height: 100%;
    }
  }
`;

const CameraContainer = styled.div`
  position: relative;
  height: 100%;

  @media (orientation: portrait) {
    display: none;
  }

  @media (orientation: landscape) {
    video {
      height: 100%;
    }
  }
`;
