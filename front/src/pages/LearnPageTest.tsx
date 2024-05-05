import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import IconButton from "../components/button/IconButton";
import { Videocam } from "@mui/icons-material";

const LearnPageTest = () => {
  const cameraRef = useRef<HTMLVideoElement>(null);

  // 카메라 크기
  const [cameraSize, setCameraSize] = useState({
    width: 0,
    height: 0,
  });

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

  // 카메라 크기 초기화
  const initVideoSize = () => {
    let height = 0;
    let width = 0;

    // 모바일 세로인 경우
    if (window.innerWidth < 480) {
      height = window.innerHeight * 0.8;
      width = Math.floor((height * 9) / 16);
    }
    // 모바일 가로 또는 가로 길이 480 이상인 경우
    else {
      height = window.innerHeight - 1;
      width = Math.floor((height * 9) / 16);
    }

    setCameraSize({ width, height });
  };

  // 카메라 설정과 크기를 초기화한다.
  useEffect(() => {
    initCamera();
    initVideoSize();
  }, [initCamera]);

  // 화면 크기가 바뀔 때마다 영상과 카메라 크기를 초기화한다.
  // resize 이벤트 추가, 삭제
  useEffect(() => {
    (() => {
      window.addEventListener("resize", () => {
        setTimeout(() => initVideoSize(), 200);
      });
    })();

    return () => {
      window.removeEventListener("resize", () => initVideoSize());
    };
  }, []);

  return (
    <Container>
      <LeftSection>
        <SectionButtonList>
          <SectionButton className="">0:00</SectionButton>
          <SectionButton className="">0:00</SectionButton>
          <SectionButton className="">0:00</SectionButton>
          <SectionButton className="">0:00</SectionButton>
        </SectionButtonList>
      </LeftSection>
      <CenterSection>
        <VideoContainer>
          <video
            width={cameraSize.width}
            height={cameraSize.height}
            src="src/assets/sample.mp4"
            controls
          ></video>
        </VideoContainer>
        <VideoContainer>
          <video
            width={cameraSize.width}
            height={cameraSize.height}
            ref={cameraRef}
            className="camera"
            autoPlay
          ></video>
          <IconButtonList>
            <IconButton icon={<Videocam />} text="챌린지 모드" link="/challenge" />
          </IconButtonList>
        </VideoContainer>
      </CenterSection>
      <RightSection></RightSection>
    </Container>
  );
};

const IconButtonList = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 8px;
`;

const SectionButtonList = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  button {
    margin: 8px 0;
  }

  @media screen and (max-width: 479px) {
    flex-direction: row;
    justify-content: start;
    align-items: flex-start;
    overflow: scroll;
    height: auto;
    padding: 16px 0;

    button {
      min-width: 120px;
      margin: 0 8px;
    }
  }
`;

const SectionButton = styled.button`
  width: 100%;
  max-width: 140px;
  height: 40px;
  font-size: 16px;
  color: inherit;
  background-color: #353535;
  border: 1px solid #808080;
  border-radius: 4px;

  &.small {
    width: 40px;
    border-radius: 50%;
  }
`;

const VideoContainer = styled.div`
  display: flex;
  height: 100%;

  video {
    object-fit: cover;
  }

  @media screen and (max-width: 479px) {
    .camera {
      display: none;
    }
  }
`;

const RightSection = styled.section`
  flex: 1;
  position: relative;
  margin: 8px;

  @media screen and (max-width: 479px) {
    display: none;
  }
`;

const CenterSection = styled.section`
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const LeftSection = styled.section`
  flex: 1;
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: #fff;
  margin: 8px;

  @media screen and (max-width: 479px) {
    /* height: 20%; */
    /* overflow: scroll; */
    align-items: start;
  }
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  background-color: #000;

  @media screen and (max-width: 479px) {
    display: flex;
    flex-direction: column-reverse;
  }
`;

export default LearnPageTest;
