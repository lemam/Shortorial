import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { Videocam } from "@mui/icons-material";

import MotionCameraTest from "./MotionCameraTest";
import { Shorts } from "../../constants/types";
import { motionButtons } from "../../constants/motionButtons";
import { getShortsInfo } from "../../apis/shorts";
import useCameraStore from "./useCameraStore";
import useMotionButtonStore from "../../store/useMotionButtonStore";

interface Size {
  width: number;
  height: number;
}

const mediaSize = {
  medium: 1024,
  small: 640,
};

function LearnPageTest() {
  const [videoInfo, setVideoInfo] = useState<Shorts | null>(null);
  const { userPermission } = useCameraStore();
  const params = useParams();

  const timestampSectionRef = useRef<HTMLDivElement>(null);
  const [videoSize, setVideoSize] = useState<Size>({ width: 0, height: 0 });

  const buttonRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { setButtons, getProgress, getActiveButtonId } = useMotionButtonStore();

  const videoRef = useRef<HTMLVideoElement>(null);

  // 쇼츠 영상 데이터 가져오기
  const loadVideo = useCallback(async () => {
    if (params.shortsNo) {
      const data: Shorts = await getShortsInfo(params.shortsNo);
      if (data) setVideoInfo(data);
    }
  }, [params.shortsNo]);

  /**
   * 화면 크기에 맞춰 비디오 요소의 크기를 계산합니다.
   *
   * 브라우저 전체 크기에서 TimestampSection 크기를 뺀 나머지 공간을 컨테이너라고 하겠습니다.
   * 다시 말해, 컨테이너는 현재 사용할 수 있는 최대 넓이를 뜻합니다.
   *
   * 먼저 컨테이너의 가로, 세로 길이를 구합니다. (srcWidth, scrHeight)
   * 그리고 위에서 구한 가로, 세로 길이 각각을 기준으로 하는 9:16 비율의 길이를 구합니다. (ratioWidth, ratioHeight)
   *
   * 마지막으로 컨테이너가 비율에 맞춰 계산한 값을 수용 가능한지 확인합니다.
   * 컨테이너의 크기가 비율에 맞춰 계산한 값보다 큰 경우 비율에 맞춰 계산한 값을 적용할 수 있습니다.
   * 그렇지 않은 경우, 스크린 밖으로 나가지 않도록 가로세로의 값을 조정합니다.
   */
  const calcVideoSize = useCallback(() => {
    const section = timestampSectionRef.current;

    if (section && videoInfo) {
      let srcWidth = 0;
      let srcHeight = 0;

      // 컨테이너 크기 계산
      if (window.innerWidth > mediaSize.medium) {
        srcWidth = (window.innerWidth - section.offsetWidth) / 2;
        srcHeight = section.offsetHeight;
      } else {
        srcWidth = section.offsetWidth;
        srcHeight = window.innerHeight - section.offsetHeight;

        if (window.innerWidth > mediaSize.small) srcWidth /= 2; // 미디어 사이즈가 medium인 경우
      }

      // 9:16 비율의 화면 크기 계산
      const ratioWidth = (srcHeight * 9) / 16;
      const ratioHeight = (srcWidth * 16) / 9;

      // 컨테이너에 맞춰 크기 조정
      const width = srcWidth >= ratioWidth ? ratioWidth : srcWidth;
      const height = srcWidth >= ratioWidth ? srcHeight : ratioHeight;

      setVideoSize({ width, height });
    }
  }, [videoInfo]);

  const handlePlay = () => {
    console.log("영상 재생!");
  };

  const handleRepeat = () => {
    console.log("구간 반복 활성화!");
  };

  const handleMirrorMode = () => {
    console.log("거울 모드 변경!");
  };

  const handleSpeedChange = () => {
    console.log("배속 변경!");
  };

  const handleChallenge = () => {
    console.log("챌린지 페이지로 이동!");
  };

  // 버튼 action에 따른 클릭 핸들러 매핑
  const buttonClickActions: { [key: string]: () => void } = useMemo(() => {
    return {
      play: handlePlay,
      repeat: handleRepeat,
      mirror: handleMirrorMode,
      speed: handleSpeedChange,
      challenge: handleChallenge,
    };
  }, []);

  // 재생 모션 버튼 정보를 store에 저장한다.
  const initMotionButton = useCallback(() => {
    const buttons = buttonRefs.current;

    if (buttons) {
      const buttonList = buttons
        .map((button, idx) => {
          if (!button) return null;

          return {
            minX: button.offsetLeft,
            maxX: button.offsetLeft + button.offsetWidth,
            minY: button.offsetTop,
            maxY: button.offsetTop + button.offsetHeight,
            click: buttonClickActions[motionButtons[idx].action],
          };
        })
        .filter(el => el != null);

      setButtons(buttonList);
    }
  }, [buttonClickActions, setButtons]);

  // 쇼츠 영상 가져오기
  useEffect(() => {
    loadVideo();
  }, [loadVideo]);

  // 비디오 크기 계산하기
  useEffect(() => {
    calcVideoSize();
    window.addEventListener("resize", calcVideoSize);

    return () => window.addEventListener("resize", calcVideoSize);
  }, [calcVideoSize]);

  // 모션인식 버튼 초기화
  useEffect(() => {
    window.addEventListener("load", initMotionButton);

    return () => window.removeEventListener("load", initMotionButton);
  }, [initMotionButton]);

  return (
    <Layer>
      {!userPermission && (
        <CameraAlert>
          <CameraAlertBox>
            <div>
              카메라 접근이 차단되었습니다. 상단 아이콘 <Videocam />을 클릭하여 접근을 허용 후 새로고침해주세요.
            </div>
          </CameraAlertBox>
        </CameraAlert>
      )}
      <Container>
        <TimestampSection ref={timestampSectionRef}>
          <Button>0:00</Button>
          <Button>0:10</Button>
          <Button>0:20</Button>
          <Button>0:30</Button>
        </TimestampSection>
        <VideoSection>
          {videoInfo && (
            <VideoContainer>
              <VideoBox style={{ width: `${videoSize.width}px`, height: `${videoSize.height}px` }}>
                <Video src={videoInfo.shortsLink} crossOrigin="anonymous" ref={videoRef}></Video>
              </VideoBox>
            </VideoContainer>
          )}
          <VideoContainer className={`camera ${window.innerWidth < mediaSize.small ? "hidden" : ""}`}>
            <VideoBox style={{ width: `${videoSize.width}px`, height: `${videoSize.height}px` }}>
              <MotionCameraTest />
              <Controller>
                {motionButtons.map((button, idx) => (
                  <ControlButtonContainer
                    ref={button => (buttonRefs.current[idx] = button)}
                    onClick={buttonClickActions[button.action]}
                  >
                    <ControlButton key={idx}>{button.icon}</ControlButton>
                    <CircleWrapper viewBox="0 0 60 60">
                      <CircleProgress
                        cx={30}
                        cy={30}
                        r={28}
                        progress={idx === getActiveButtonId() ? getProgress() : 0}
                      />
                    </CircleWrapper>
                  </ControlButtonContainer>
                ))}
              </Controller>
            </VideoBox>
          </VideoContainer>
        </VideoSection>
      </Container>
    </Layer>
  );
}

const CameraAlert = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 100;
`;

const CameraAlertBox = styled.div`
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translate(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  height: 160px;
  padding: 16px;
  font-size: 32px;
  color: white;
  text-align: center;
  word-break: keep-all;
  background: #232323;
  border-radius: 8px;
  z-index: 100;
`;

const Layer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000;
  background: linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(48, 13, 45, 1) 80%, rgba(112, 0, 102, 1) 100%);
`;

const Container = styled(Layer)`
  display: flex;
  flex-direction: row;
  justify-content: center;

  @media screen and (max-width: ${mediaSize.medium}px) {
    flex-direction: column-reverse;
  }
`;

const TimestampSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-basis: 160px;
  flex-shrink: 0;
  padding: 0 24px;

  @media screen and (max-width: ${mediaSize.medium}px) {
    flex-direction: row;
    flex-basis: 100px;
  }
`;

const Button = styled.button`
  width: 160px;
  height: 40px;
  margin: 8px 0;
  border-radius: 4px;
  border: 1px solid red;
`;

const VideoSection = styled.section`
  position: relative;
  display: flex;
  justify-content: center;
`;

const VideoContainer = styled.div`
  position: relative;
  align-items: center;
  height: 100%;
  overflow: hidden;

  &.hidden {
    visibility: hidden;
  }

  @media screen and (max-width: ${mediaSize.small}px) {
    &.camera {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

const Controller = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  height: 50%;
  margin: 16px 0;
  padding: 0 8px;
`;

const ControlButtonContainer = styled.div`
  position: relative;
  cursor: pointer;

  &:hover button,
  &:active button {
    border: 3px solid #fb2576;
  }
`;

const ControlButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  margin-bottom: 16px;
  color: white;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  box-sizing: border-box;

  &:hover,
  &:active {
    border: 3px solid #fb2576;
  }
`;

const CircleWrapper = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(-90deg);
  width: 60px;
  height: 60px;
`;

const CircleProgress = styled.circle<{ r: number; progress: number }>`
  fill: none;
  stroke: #fb2576;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: ${({ r }) => r * Math.PI * 2};
  stroke-dashoffset: ${({ r, progress }) => r * Math.PI * 2 * (1 - progress / 100)};
  transition: stroke-dashoffset 0.5s ease;
`;

const VideoBox = styled.div`
  position: relative;
  height: 100%;
  aspect-ratio: 9/16;
  background-color: #000;
`;

const Video = styled.video`
  width: 100%;
`;

export default LearnPageTest;
