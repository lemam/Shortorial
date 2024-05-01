import { useCallback, useEffect, useRef } from "react";
import danceVideo from "/src/assets/sample.mp4";
import styled from "styled-components";
import IconButton from "../../components/button/IconButton";
import { Videocam } from "@mui/icons-material";
import SectionButton from "./SectionButton";

// 기존화면 + learn1 + 버튼 동그라미로 축소화

const LearnPage3 = () => {
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
      else if (window.screen.orientation.angle === 0 || window.screen.orientation.angle === 180) {
        videoRef.current.height = window.innerHeight * 0.8;
      }

      // width 설정
      videoRef.current.width = Math.floor((videoRef.current.height * 9) / 16);
    }
  };

  useEffect(() => {
    initCamera();
    initVideoSize(videoRef);
    initVideoSize(cameraRef);

    (() => {
      // 화면 방향이 바뀔 때 영상과 카메라 크기도 재설정
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
      <ButtonSection>
        <SectionButtonList>
          <SectionButton size="small" />
          <SectionButton size="small" />
          <SectionButton size="small" />
          <SectionButton size="small" />
        </SectionButtonList>
      </ButtonSection>
      <VideoSection>
        <VideoContainer>
          <video src={danceVideo} ref={videoRef} controls></video>
        </VideoContainer>
        <CameraContainer>
          <Camera ref={cameraRef} autoPlay></Camera>
          <div style={{ position: "absolute", top: 0, right: 0 }}>
            <IconButton icon={<Videocam />} text="챌린지 모드" link="/challenge" />
          </div>
        </CameraContainer>
      </VideoSection>
      <RightSection></RightSection>
    </Container>
  );
};

const VideoSection = styled.section`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  flex: 2;
`;

const RightSection = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const SectionButtonList = styled.section`
  button {
    margin: 8px;
  }
`;

const ButtonSection = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const Container = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  background-color: #000;

  @media screen and (min-width: 1024), screen and (orientation: landscape) {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
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

export default LearnPage3;
