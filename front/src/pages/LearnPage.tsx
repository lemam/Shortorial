import { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import danceVideo from "../assets/sample.mp4";
import IconButton from "../components/IconButton";
import VideocamIcon from "@mui/icons-material/Videocam";

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
      <div style={{ width: "20%" }}></div>
      <VideoContainer>
        <VideoBox className="video">
          <Video src={danceVideo}></Video>
          <IconGroup>
            <IconButton
              link="/challenge"
              icon={<VideocamIcon />}
              text="촬영하기"
            />
          </IconGroup>
        </VideoBox>
        <VideoBox className="camera">
          <Camera id="userCamera" ref={cameraRef} autoPlay playsInline></Camera>
        </VideoBox>
      </VideoContainer>
      <div style={{ position: "relative", width: "20%" }}></div>
    </Container>
  );
}

const VideoContainer = styled.div`
  position: relative;
  display: flex;
  @media screen and (orientation: portrait) {
    justify-content: center;
    height: 80%;
  }

  @media screen and (orientation: landscape) {
    height: 100%;
  }
`;

const IconGroup = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  padding: 4px 8px;
  margin: 4px;
`;

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

const VideoBox = styled.div`
  position: relative;

  @media screen and (orientation: portrait) {
    &.camera {
      display: none;
    }
  }

  @media screen and (orientation: landscape) {
    height: 100%;

    &.camera {
      display: block;
    }
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
`;
