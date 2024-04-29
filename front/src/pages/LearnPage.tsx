import { useCallback, useEffect, useRef } from "react";
import danceVideo from "/src/assets/sample.mp4";
import styled from "styled-components";
import IconButton from "../components/IconButton";
import { Videocam } from "@mui/icons-material";

const LearnPage = () => {
  const cameraRef = useRef<HTMLVideoElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  // 비디오 크기 초기화
  const initVideoSize = (videoRef: React.RefObject<HTMLVideoElement>) => {
    if (videoRef.current) {
      // 가로 화면 또는 desktop일 때 height 설정
      if (
        window.screen.orientation.angle === 90 ||
        window.screen.orientation.angle === 270 ||
        window.innerWidth >= 1024
      ) {
        videoRef.current.height = window.innerHeight;
      }
      // 세로 화면일 때 height 설정
      else if (window.screen.orientation.angle === 0) {
        videoRef.current.height = window.innerHeight * 0.8;
      }

      // width 설정
      videoRef.current.width = Math.floor((videoRef.current.height * 9) / 16);
    }
  };

  useEffect(() => {
    initCamera();

    (() => {
      // 화면 크기가 바뀔 때 영상과 카메라 크기도 재설정
      window.addEventListener("orientationchange", () => {
        setTimeout(() => initVideoSize(videoRef), 200);
      });
      window.addEventListener("orientationchange", () => {
        setTimeout(() => initVideoSize(cameraRef), 200);
      });
    })();

    return () => {
      window.removeEventListener("orientationchange", () => initVideoSize(videoRef));
      window.removeEventListener("orientationchange", () => initVideoSize(cameraRef));
    };
  }, [initCamera]);

  return (
    <Container>
      <VideoContainer>
        <video src={danceVideo} ref={videoRef} controls></video>
      </VideoContainer>
      <CameraContainer>
        <Camera ref={cameraRef} autoPlay></Camera>
        <IconButton icon={<Videocam />} text="챌린지 모드" link="/challenge" />
      </CameraContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  background-color: #000;
`;

const VideoContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`;

const CameraContainer = styled.div`
  position: relative;
  display: none;

  @media screen and (min-width: 1024) {
    display: flex;
  }

  @media screen and (orientation: landscape) {
    display: flex;
  }
`;

const Camera = styled.video`
  transform: scaleX(-1);
`;

export default LearnPage;
