import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Flip, Pause, PlayArrow, Repeat, Videocam } from "@mui/icons-material";
import VideoMotionButton from "../components/button/VideoMotionButton";
import { VideoSection } from "../constants/types";
import SectionButtonList from "../components/buttonList/SectionButtonList";
import MotionCamera from "../components/motion/MotionCamera";
import { useBtnStore, useMotionDetectionStore } from "../store/useMotionStore";
import { setBtnInfo } from "../modules/Motion";
import useVideoStore from "../store/useVideoStore";
import { useNavigate } from "react-router-dom";

const LearnPageTest = () => {
  type LearnState = "PAUSE" | "READY" | "PLAY";
  const READY_TIMER = 3;
  const PLAY_SPEEDS = [1, 0.75, 0.5];

  const navigate = useNavigate();

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

  const { currentSection, loopSection, setLoopSection } = useVideoStore();
  const { btn } = useBtnStore();
  const { playCount, challengeCount, repeatCount, flipCount, speedCount } =
    useMotionDetectionStore();

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
    setState("PAUSE");
  }, []);

  // READY 상태로 변경
  const changeStateReady = () => setState("READY");

  // 동영상 재생 속도 버튼 클릭 이벤트 리스너
  const handlePlaySpeedButtonClick = () => {
    const nextIdx = (playSpeedIdx + 1) % PLAY_SPEEDS.length;
    setPlaySpeedIdx(nextIdx);
  };

  // PLAY 상태로 변경
  const changeStatePlay = useCallback(() => setState("PLAY"), []);

  // 동영상 재생
  const playVideo = useCallback(() => {
    if (video) {
      video.playbackRate = currPlaySpeed;
      video.play();
    }
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

  const startTimer = () => {
    intervalRef.current = setInterval(() => setCurrTimer((prev) => prev - 1), 1000);
  };

  // 일시 정지
  const pauseVideo = useCallback(() => {
    if (video) {
      initInterval();
      video.currentTime = currentSection.start;
      video.pause();
    }
  }, [currentSection.start, initInterval, video]);

  // 상태 업데이트
  useEffect(() => {
    switch (state) {
      case "PAUSE":
        pauseVideo();
        break;
      case "READY":
        pauseVideo();
        if (!intervalRef.current) startTimer();
        break;
      case "PLAY":
        playVideo();
        break;
      default:
        break;
    }
  }, [isLooping, loopSection, pauseVideo, playVideo, state]);

  // 타이머 감시
  useEffect(() => {
    // 카운트다운이 끝나면 재생 상태로 변경
    if (intervalRef.current && currTimer <= 0) {
      initInterval();
      changeStatePlay();
    }
  }, [changeStatePlay, currTimer, initInterval]);

  const handleTimeUpdate = useCallback(() => {
    if (video) {
      setCurrentTime(video.currentTime);
      console.log(loopSection);

      if (isLooping && loopSection) {
        if (video.currentTime >= loopSection?.end || video.ended) {
          video.currentTime = loopSection.start;
        }
      }
    }
  }, [isLooping, loopSection, video]);

  // 동영상 감시
  useEffect(() => {
    if (video) {
      video.addEventListener("ended", changeStatePause);
      video.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (video) {
        video.removeEventListener("ended", changeStatePause);
        video.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [changeStatePause, handleTimeUpdate, video]);

  // 동영상 구간 리스트 가져오기
  useEffect(() => {
    setSectionList(getSectionList());
  }, []);

  useEffect(() => {
    switch (btn) {
      case "play":
        if (state == "PAUSE") changeStateReady();
        else changeStatePause();
        break;
      case "challenge":
        navigate("/challenge");
        break;
      case "repeat":
        handleLoopButtonClick();
        break;
      case "flip":
        setIsFlipped(!isFlipped);
        break;
      case "speed":
        handlePlaySpeedButtonClick();
        break;
    }
  }, [btn]);

  useEffect(() => {
    setBtnInfo();
  }, [cameraSize.width]);

  const handleLoopButtonClick = () => {
    setISLooping(!isLooping);
    setLoopSection(currentSection);
  };

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
                progress={playCount}
              />
            ) : (
              <VideoMotionButton
                id="play"
                icon={<Pause />}
                toolTip="일시정지"
                onClick={changeStatePause}
                progress={playCount}
              />
            )}
            <div className="foldList">
              <VideoMotionButton
                id="challenge"
                icon={<Videocam />}
                toolTip="챌린지 모드로 이동"
                link="/challenge"
                progress={challengeCount}
              />
              {isLooping ? (
                <VideoMotionButton
                  id="repeat"
                  icon={<Repeat />}
                  toolTip="구간 반복 해제"
                  onClick={() => setISLooping(!isLooping)}
                  progress={repeatCount}
                />
              ) : (
                <VideoMotionButton
                  id="repeat"
                  imgSrc="src/assets/icon/repeat-off.svg"
                  toolTip="구간 반복"
                  onClick={handleLoopButtonClick}
                  progress={repeatCount}
                />
              )}
              <VideoMotionButton
                id="flip"
                icon={<Flip />}
                toolTip="거울 모드"
                onClick={() => setIsFlipped(!isFlipped)}
                progress={flipCount}
              />
              <VideoMotionButton
                id="speed"
                text={`${currPlaySpeed}x`}
                toolTip="재생 속도"
                onClick={handlePlaySpeedButtonClick}
                progress={speedCount}
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
      width: 55px;
      height: 55px;
      margin-bottom: 36px;
    }
  }
`;

export default LearnPageTest;
