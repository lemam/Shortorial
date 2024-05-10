import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Flip, Pause, PlayArrow, Repeat, Videocam } from "@mui/icons-material";
import VideoMotionButton from "../components/button/VideoMotionButton";
import { VideoSection } from "../constants/types";
import SectionButtonList from "../components/ButtonList/SectionButtonList";
import MotionCamera from "../components/motion/MotionCamera";
import { useBtnStore } from "../store/useMotionStore";
import { setBtnInfo } from "../modules/Motion";

const LearnPageTest = () => {
  type LearnState = "PAUSE" | "READY" | "PLAY";
  const READY_TIMER = 3;
  const PLAY_SPEEDS = [1, 0.75, 0.5];

  const videoRef = useRef<HTMLVideoElement>(null);
  const video = videoRef.current;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [leftSectionWidth, setLeftSectionWidth] = useState<number>(0);

  const [state, setState] = useState<LearnState>("PAUSE");
  const [cameraSize, setCameraSize] = useState({
    width: 0,
    height: 0,
  });

  const [currTimer, setCurrTimer] = useState<number>(READY_TIMER);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [playSpeedIdx, setPlaySpeedIdx] = useState<number>(0);
  const currPlaySpeed = PLAY_SPEEDS[playSpeedIdx];
  const [isLooping, setISLooping] = useState<boolean>(false);

  const [sectionList, setSectionList] = useState<VideoSection[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);

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

  // 타이머 초기화
  const initInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setCurrTimer(READY_TIMER);
  }, [READY_TIMER]);

  // PAUSE 상태로 변경
  const changeStatePause = useCallback(() => {
    // 타이머 중지한다.
    // 동영상 중지 후 처음으로 돌아간다.
    if (video) {
      initInterval();
      video.pause();
    }
    setState("PAUSE");
  }, [initInterval, video]);

  // READY 상태로 변경
  const changeStateReady = () => {
    // 타이머 1초씩 카운트다운
    intervalRef.current = setInterval(() => setCurrTimer((prev) => prev - 1), 1000);
    setState("READY");
  };

  // 동영상 재생 속도 버튼 클릭 이벤트 리스너
  const handlePlaySpeedButtonClick = () => {
    const nextIdx = (playSpeedIdx + 1) % PLAY_SPEEDS.length;
    setPlaySpeedIdx(nextIdx);
  };

  // PLAY 상태로 변경
  const changeStatePlay = useCallback(() => {
    // 동영상 재생
    if (video) {
      video.playbackRate = currPlaySpeed;
      video.play();
    }
    setState("PLAY");
  }, [currPlaySpeed, video]);

  // 동영상 구간 리스트 반환
  const getSectionList = () => {
    // 동영상을 3초마다 구간으로 나눈다.
    // TODO: API로 받을 값 (동영상 전체 길이)
    const videoLength = 17;
    const secondsPerSection = 3;
    const numberOfSections = videoLength / secondsPerSection;
    const result: VideoSection[] = [];

    for (let i = 0; i < numberOfSections; i++) {
      result.push({
        id: i,
        start: i * secondsPerSection,
        end: (i + 1) * secondsPerSection,
      });
    }

    return result;
  };

  // 비디오 시간 time초로 이동
  const moveVideoTime = (time: number) => {
    if (video) {
      video.currentTime = time;
      setCurrentTime(time);
    }
  };

  // 카메라 초기화
  useEffect(() => {
    initVideoSize();

    window.addEventListener("resize", initVideoSize);

    return () => {
      window.removeEventListener("resize", initVideoSize);
    };
  }, []);

  // 타이머 감시
  useEffect(() => {
    // 카운트다운이 끝나면 재생 상태로 변경
    if (currTimer <= 0) {
      initInterval();
      changeStatePlay();
    }
  }, [changeStatePlay, currTimer, initInterval]);

  // 동영상 감시
  const { btn, setBtn } = useBtnStore();
  useEffect(() => {
    if (video) {
      video.addEventListener("ended", changeStatePause);
      video.addEventListener("timeupdate", () => setCurrentTime(video.currentTime));
    }

    return () => {
      if (video) {
        video.removeEventListener("ended", changeStatePause);
        video.removeEventListener("timeupdate", () => setCurrentTime(video.currentTime));
      }
    };
  }, [changeStatePause, video]);

  // 동영상 구간 리스트 가져오기
  useEffect(() => {
    setSectionList(getSectionList());
  }, []);

  useEffect(() => {
    switch (btn) {
      case "play":
        console.log("A");
        changeStateReady();
        break;
    }
    setBtn("none");
  }, [btn, setBtn]);

  useEffect(() => {
    setBtnInfo();
  }, [cameraSize.width]);

  return (
    <Container>
      <LeftSection ref={(el) => measuredRef(el)}>
        <SectionButtonList
          sectionList={sectionList}
          parentWidth={leftSectionWidth}
          currentTime={currentTime}
          clickHandler={(section) => moveVideoTime(section.start)}
        />
      </LeftSection>
      <CenterSection>
        <VideoContainer>
          <video
            width={cameraSize.width}
            height={cameraSize.height}
            src="src/assets/sample.mp4"
            ref={videoRef}
            className={isFlipped ? "flip" : ""}
            controls
          ></video>
        </VideoContainer>
        <VideoContainer id="dom">
          <MotionCamera
            width={cameraSize.width}
            height={cameraSize.height}
            className="camera flip"
            autoPlay
          ></MotionCamera>
          <VideoMotionButtonList>
            {state === "PAUSE" ? (
              <VideoMotionButton
                id="play"
                icon={<PlayArrow />}
                toolTip="재생"
                onClick={changeStateReady}
              />
            ) : (
              <VideoMotionButton
                id="play"
                icon={<Pause />}
                toolTip="일시정지"
                onClick={changeStatePause}
              />
            )}
            <div className="foldList">
              <VideoMotionButton
                icon={<Videocam />}
                toolTip="챌린지 모드로 이동"
                link="/challenge"
              />
              {isLooping ? (
                <VideoMotionButton
                  icon={<Repeat />}
                  toolTip="구간 반복 해제"
                  onClick={() => setISLooping(!isLooping)}
                />
              ) : (
                <VideoMotionButton
                  imgSrc="src/assets/icon/repeat-off.svg"
                  toolTip="구간 반복"
                  onClick={() => setISLooping(!isLooping)}
                />
              )}
              <VideoMotionButton
                icon={<Flip />}
                toolTip="거울 모드"
                onClick={() => setIsFlipped(!isFlipped)}
              />
              <VideoMotionButton
                text={`${currPlaySpeed}x`}
                toolTip="재생 속도"
                onClick={handlePlaySpeedButtonClick}
              />
            </div>
          </VideoMotionButtonList>
        </VideoContainer>
        {state === "READY" && <Timer>{currTimer}</Timer>}
      </CenterSection>
      <RightSection></RightSection>
    </Container>
  );
};

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

const Section = styled.section`
  position: relative;
  display: flex;
`;

const RightSection = styled(Section)`
  flex: 1;
  margin: 8px;

  @media screen and (max-width: 479px) {
    display: none;
  }
`;

const CenterSection = styled(Section)`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const LeftSection = styled(Section)`
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  margin: 8px;
  color: #fff;

  @media screen and (max-width: 479px) {
    align-items: start;
  }
`;

const VideoContainer = styled.div`
  display: flex;
  height: 100%;

  video {
    display: flex;
    object-fit: cover;
  }

  video.flip {
    transform: scaleX(-1);
  }

  @media screen and (max-width: 479px) {
    .camera {
      display: none;
    }
  }
`;

const Timer = styled.div`
  position: absolute;
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

const VideoMotionButtonList = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  display: flex;
  flex-direction: column;
  margin: 8px;

  .foldList {
    display: flex;
    flex-direction: column;
  }

  button {
    display: inline-block;
    margin-bottom: 24px;
  }

  @media screen and (min-width: 768px) {
    button {
      width: 52px;
      height: 52px;
      margin-bottom: 36px;
    }
  }
`;

export default LearnPageTest;
