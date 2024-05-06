import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Videocam } from "@mui/icons-material";
import IconButton from "../components/button/IconButton";
import SectionButton from "../components/button/SectionButton";

// 각 구간의 [시작, 끝) 시간 더미 데이터
// TODO: API로 가져올 것
const timeData = [
  [0, 3],
  [3, 6],
  [6, 9],
  [9, 12],
  [12, 15],
  [15, 18],
];

const LearnPageTest = () => {
  const cameraRef = useRef<HTMLVideoElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [leftSectionWidth, setLeftSectionWidth] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

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

  // LeftSection 요소의 너비 저장
  const measuredRef = useCallback((node: HTMLElement | null) => {
    if (node) {
      setLeftSectionWidth(node.getBoundingClientRect().width);
    } else {
      setLeftSectionWidth(0);
    }
  }, []);

  // 카메라 설정과 크기를 초기화한다.
  useEffect(() => {
    initCamera();
    initVideoSize();
  }, [initCamera]);

  // 화면 크기가 바뀔 때마다 영상과 카메라 크기를 초기화한다. (resize 이벤트 추가, 삭제)
  // 동영상의 재생시간이 업데이트 될 때마다 현재 시간을 저장한다. (timeupdate 이벤트 추가, 삭제)
  useEffect(() => {
    window.addEventListener("resize", initVideoSize);

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      window.removeEventListener("resize", initVideoSize);

      if (videoElement) {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, []);

  // 동영상의 시간이 변경될 때마다 현재 시간을 업데이트한다.
  const handleTimeUpdate = (e: Event) => {
    setCurrentTime((e.target as HTMLVideoElement).currentTime);
  };

  // 동영상의 시간을 이동한다.
  const handleClickSectionButton = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  // 동영상의 시간이 현재 구간의 시간과 일치하는지 여부를 반환한다.
  const getIsCurrentSection = (start: number, end: number) => {
    return currentTime >= start && currentTime < end;
  };

  return (
    <Container>
      <LeftSection ref={(el) => measuredRef(el)}>
        <SectionButtonList>
          {timeData.map((time, index) => (
            <SectionButton
              key={index}
              time={time[0]}
              isSmall={leftSectionWidth < 100}
              active={getIsCurrentSection(time[0], time[1])}
              onClick={() => handleClickSectionButton(time[0])}
            ></SectionButton>
          ))}
        </SectionButtonList>
      </LeftSection>
      <CenterSection>
        <VideoContainer>
          <video
            width={cameraSize.width}
            height={cameraSize.height}
            src="src/assets/sample.mp4"
            ref={videoRef}
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
