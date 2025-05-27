import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { Flip, Pause, PlayArrow, Videocam } from "@mui/icons-material";
import { TbRepeat, TbRepeatOff } from "react-icons/tb";

import MotionCameraTest from "../components/motion/MotionCameraTest";
import VideoMotionButton2 from "../components/button/VideoMotionButton2";

import { getShortsInfo } from "../apis/shorts";
import useCameraStore from "../store/useCameraStore";
import { Shorts } from "../constants/types";

type LearnState = "INIT" | "PAUSE" | "READY" | "PLAY";

interface Size {
  width: number;
  height: number;
}

const mediaSize = {
  medium: 1024,
  small: 640,
};

const TIMESTAMP_INTERVAL = 3; // 타임스탬프 구간 당 시간(초)

const LearnPage2 = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { userPermission } = useCameraStore();

  const [state, setState] = useState<LearnState>("INIT");

  const [videoInfo, setVideoInfo] = useState<Shorts | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const timestampSectionRef = useRef<HTMLDivElement>(null);
  const [videoSize, setVideoSize] = useState<Size>({ width: 0, height: 0 });

  const [isRepeating, setIsRepeating] = useState<boolean>(false);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1);

  const [timestampList, setTimestampList] = useState<number[]>([]);
  const [currTimestampIdx, setCurrTimestampIdx] = useState<number>(0); // 현재 타임스탬프 인덱스

  const TIMER = 3;
  const [currentTimer, setCurrentTimer] = useState<number>(TIMER);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 쇼츠 영상 데이터 가져오기
  const loadVideo = async (shortsNo: string) => {
    const data: Shorts = await getShortsInfo(shortsNo);
    if (data) setVideoInfo(data);
  };

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

  // 재생 버튼 클릭 이벤트 핸들러
  const handleClickPlayButton = () => {
    if (state === "PAUSE") setState("READY");
    else setState("PAUSE");
  };

  // 반복 버튼 클릭 이벤트 핸들러
  const handleClickRepeatButton = () => {
    setIsRepeating(prev => !prev);
  };

  // 거울 모드 버튼 클릭 이벤트 핸들러
  const handleClickFlipButton = () => {
    setIsFlipped(prev => !prev);
  };

  // 속도 버튼 클릭 이벤트 핸들러
  const handleClickSpeedButton = () => {
    const speeds = [1, 0.75, 0.5];
    const idx = speeds.findIndex(el => el === playSpeed);
    setPlaySpeed(speeds[(idx + 1) % speeds.length]);
  };

  // 챌린지 이동 버튼 클릭 이벤트 핸들러
  const handleClickChallengeButton = () => {
    navigate(`/challenge/${params.shortsNo}`);
  };

  // 타임스탬프 버튼 클릭 이벤트 핸들러
  function handleClickTimestamp(event: React.MouseEvent<HTMLButtonElement>): void {
    if (videoRef.current) {
      videoRef.current.currentTime = Number(event.currentTarget.value); // 클릭한 시간으로 영상 이동
    }
  }

  // Video TimeUpdate 이벤트 핸들러
  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      console.log(videoRef.current.currentTime);

      // 현재 재생 시간에 해당하는 타임 스탬프 인덱스 계산
      const idx = Math.floor(videoRef.current.currentTime / TIMESTAMP_INTERVAL);
      if (currTimestampIdx !== idx) setCurrTimestampIdx(idx);
    }
  }, [currTimestampIdx]);

  // 현재 로딩된 영상의 타임스탬프 리스트를 생성하여 저장합니다.
  const calcTimeStampList = useCallback(() => {
    if (!videoInfo) return;

    const size = videoInfo.shortsTime / TIMESTAMP_INTERVAL;
    const timeArr = Array.from({ length: size }, (_, idx) => idx * TIMESTAMP_INTERVAL);
    setTimestampList(timeArr);
  }, [videoInfo]);

  // 숫자(초)를 0:00 형식으로 바꾼 문자열을 반환합니다.
  const formatTime = (time: number) => {
    if (!time) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const formatedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${minutes}:${formatedSeconds}`;
  };

  /**
   * 컴포넌트가 마운트 되고 난 후, 영상의 데이터를 가져와 저장합니다.
   */
  useEffect(() => {
    if (params.shortsNo) loadVideo(params.shortsNo);
  }, [params.shortsNo]);

  /**
   * videoInfo와 videoRef가 로딩이 완료된 후 실행되는 이펙트입니다.
   * 준비 완료 상태인 PAUSE 상태로 변환하고, 영상의 타임스탬프 리스트를 저장합니다.
   */
  useEffect(() => {
    const video = videoRef.current;
    if (videoInfo && video) {
      setState("PAUSE");
      calcTimeStampList(); // 타임스탬프 저장
    }
  }, [calcTimeStampList, videoInfo]);

  /**
   * videoRef에 이벤트를 등록합니다.
   */
  useEffect(() => {
    const video = videoRef.current;
    if (videoInfo && video) video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      if (video) video.addEventListener("timeupdate", handleTimeUpdate);
    };
  }, [handleTimeUpdate, videoInfo]);

  /**
   * 화면 크기에 맞춰 video 크기를 계산합니다.
   * resize 이벤트 리스너를 등록하여 브라우저 크기 변경 시에도 실행됩니다.
   */
  useEffect(() => {
    calcVideoSize();
    window.addEventListener("resize", calcVideoSize);

    return () => window.removeEventListener("resize", calcVideoSize);
  }, [calcVideoSize]);

  // PUASE 상태 업데이트
  useEffect(() => {
    const video = videoRef.current;

    if (state === "PAUSE" && video) {
      video.pause();
      video.currentTime = timestampList[currTimestampIdx];
    }
  }, [currTimestampIdx, state, timestampList]);

  // READY 상태 업데이트
  // 카운트다운 시작 및 종료 시점을 감지합니다.
  useEffect(() => {
    let timer = timerRef.current;

    if (state === "READY") {
      // 카운트다운 시작
      timer = setInterval(() => {
        setCurrentTimer(prev => {
          // 카운트다운 완료 - Interval 해제 후 PLAY 상태로 변환
          if (prev <= 1) {
            if (timer) clearInterval(timer);
            setState("PLAY");
            return TIMER;
          }

          return prev - 1; // 1초 감소
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [state]);

  // PLAY 상태 업데이트
  useEffect(() => {
    if (state === "PLAY") {
      const video = videoRef.current;

      // 영상 재생
      if (video) {
        if (video.ended) video.currentTime = 0;
        video.playbackRate = playSpeed;
        video.play();
      }
    }
  }, [playSpeed, state]);

  return (
    <Container>
      {!userPermission && (
        <CameraAlert>
          <CameraAlertBox>
            <div>
              카메라 접근이 차단되었습니다. 상단 아이콘 <Videocam />을 클릭하여 접근을 허용 후 새로고침해주세요.
            </div>
          </CameraAlertBox>
        </CameraAlert>
      )}
      <Main>
        <TimestampSection ref={timestampSectionRef}>
          <TimestampList>
            {timestampList.map(
              (time, idx) =>
                videoRef.current && (
                  <Timestamp key={idx} $active={idx === currTimestampIdx} onClick={handleClickTimestamp} value={time}>
                    {formatTime(time)}
                  </Timestamp>
                )
            )}
          </TimestampList>
        </TimestampSection>
        <VideoSection>
          {videoInfo && (
            <VideoContainer>
              <VideoBox style={{ width: `${videoSize.width}px`, height: `${videoSize.height}px` }}>
                <Video src={videoInfo.shortsLink} crossOrigin="anonymous" ref={videoRef} isFlipped={isFlipped}></Video>
              </VideoBox>
            </VideoContainer>
          )}
          <VideoContainer className={`camera ${window.innerWidth < mediaSize.small ? "hidden" : ""}`}>
            <VideoBox style={{ width: `${videoSize.width}px`, height: `${videoSize.height}px` }}>
              <MotionCameraTest />
              <MotionButtonList>
                <VideoMotionButton2
                  icon={state === "PAUSE" ? <PlayArrow /> : <Pause />}
                  onClick={handleClickPlayButton}
                />
                {state === "PAUSE" && (
                  <>
                    <VideoMotionButton2
                      icon={isRepeating ? <TbRepeatOff size={24} /> : <TbRepeat size={24} />}
                      onClick={handleClickRepeatButton}
                    />
                    <VideoMotionButton2 icon={<Flip />} onClick={handleClickFlipButton} />
                    <VideoMotionButton2 icon={`${playSpeed}x`} onClick={handleClickSpeedButton} />
                    <VideoMotionButton2 icon={<Videocam />} onClick={handleClickChallengeButton} />
                  </>
                )}
              </MotionButtonList>
              {state === "READY" && <Timer>{currentTimer}</Timer>}
            </VideoBox>
          </VideoContainer>
        </VideoSection>
      </Main>
    </Container>
  );
};

export default LearnPage2;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000;
  background: linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(48, 13, 45, 1) 80%, rgba(112, 0, 102, 1) 100%);
`;

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

const Main = styled(Container)`
  display: flex;
  flex-direction: row;
  justify-content: center;

  @media screen and (max-width: ${mediaSize.medium}px) {
    flex-direction: column-reverse;
  }
`;

const TimestampSection = styled.div`
  position: relative;
  padding: 0 24px;

  @media screen and (max-width: ${mediaSize.medium}px) {
    padding: 16px 24px;
  }
`;

const TimestampList = styled.li`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 160px;
  height: 100%;
  list-style: none;

  @media screen and (max-width: ${mediaSize.medium}px) {
    flex-direction: row;
    width: 100%;
  }
`;

const Timestamp = styled.button<{ $active: boolean }>`
  width: 100%;
  height: 50px;
  margin: 8px 0;
  border-radius: 4px;
  background-color: ${props => (props.$active ? "#FF95BD50" : "#353535")};
  border: 1px solid ${props => (props.$active ? "#FB2576" : "#808080")};

  @media screen and (max-width: ${mediaSize.medium}px) {
    margin: 0 4px;
  }
`;

const VideoSection = styled.section`
  position: relative;
  display: flex;
  justify-content: center;
`;

const VideoContainer = styled.div`
  position: relative;
  display: flex;
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

const VideoBox = styled.div`
  position: relative;
  height: 100%;
  aspect-ratio: 9/16;
  background-color: #000;
`;

const Video = styled.video<{ isFlipped: boolean }>`
  width: 100%;
  transform: ${props => props.isFlipped && "scaleX(-1)"};
`;

const MotionButtonList = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 24px 8px 0;
`;

const Timer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 84px;
  height: 84px;
  font-size: 48px;
  color: #fff;
  background: #35353580;
  border: 5px solid #fff;
  border-radius: 50%;
`;
