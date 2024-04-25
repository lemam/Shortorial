import { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import danceVideo from "../assets/sample.mp4";

export default function LearnPage() {
  const cameraRef = useRef<HTMLVideoElement>(null);

  // 카메라 생성
  const setCamera = useCallback(() => {
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
    setCamera();
  }, [setCamera]);

  return (
    <Container>
      <VideoContainer>
        <Video src={danceVideo} controls></Video>
      </VideoContainer>
      <VideoContainer>
        <Camera id="userCamera" ref={cameraRef} autoPlay playsInline></Camera>
      </VideoContainer>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #000;

  @media screen and (orientation: portrait) {
    flex-direction: column;
  }

  @media screen and (orientation: landscape) {
    flex-direction: row;
    justify-content: center;
  }
`;

const VideoContainer = styled.div`
  @media screen and (orientation: portrait) {
    width: 100%;
    height: 80%;
    display: flex;
    justify-content: center;
  }

  @media screen and (orientation: landscape) {
    height: 100%;
  }
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
`;

const Camera = styled.video`
  width: 100%;
  height: 100%;
  transform: scaleX(-1); // 좌우반전

  @media screen and (orientation: portrait) {
    display: none;
  }

  @media screen and (orientation: landscape) {
    display: block;
  }
`;
