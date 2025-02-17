import { useCallback, useEffect, useRef, useState } from "react";
import MotionCameraTest from "./MotionCameraTest";
import useCameraStore from "./useCameraStore";
import { Shorts } from "../../constants/types";
import { useParams } from "react-router-dom";
import { getShortsInfo } from "../../apis/shorts";
import styled from "styled-components";
import { Flip, PlayArrow, Repeat, Videocam } from "@mui/icons-material";
import useMotionButtonStore from "../../store/useMotionButtonStore";

interface Size {
  width: number;
  height: number;
}

const mediaSize = {
  medium: 1024,
  small: 640,
};

const motionButtons = [
  {
    icon: <PlayArrow />,
    click: () => alert("재생"),
  },
  {
    icon: <Repeat />,
    click: () => alert("구간 반복"),
  },
  {
    icon: <Flip />,
    click: () => alert("거울 모드"),
  },
  {
    icon: `${1}x`,
    click: () => alert("배속 모드"),
  },
  {
    icon: <Videocam />,
    click: () => alert("챌린지로 이동"),
  },
];

function LearnPageTest() {
  const [videoInfo, setVideoInfo] = useState<Shorts | null>(null);
  const { userPermission } = useCameraStore();
  const params = useParams();

  const timestampSectionRef = useRef<HTMLDivElement>(null);
  const [videoSize, setVideoSize] = useState<Size>({ width: 0, height: 0 });

  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { setButtons } = useMotionButtonStore();

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
            click: motionButtons[idx].click,
          };
        })
        .filter(el => el != null);

      setButtons(buttonList);
    }
  }, [setButtons]);

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
                <Video src={videoInfo.shortsLink} crossOrigin="anonymous"></Video>
              </VideoBox>
            </VideoContainer>
          )}
          <VideoContainer className={`camera ${window.innerWidth < mediaSize.small ? "hidden" : ""}`}>
            <VideoBox style={{ width: `${videoSize.width}px`, height: `${videoSize.height}px` }}>
              <MotionCameraTest />
              <Controller>
                {motionButtons.map((el, idx) => (
                  <ControlButton key={idx} ref={el => (buttonRefs.current[idx] = el)} onClick={el.click}>
                    {el.icon}
                  </ControlButton>
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
  justify-content: flex-end;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
  /* height: 100%; // */
`;

const ControlButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  padding: 48px;
  margin-bottom: 16px;
  color: white;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
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
