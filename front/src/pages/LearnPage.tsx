import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Flip, Pause, PlayArrow, Repeat, Videocam } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { VideoSection } from "../constants/types";
import { getComponentSize } from "../modules/componentSize";
import { setBtnInfo } from "../modules/Motion";
import { getShortsInfo } from "../apis/shorts";
import useLearnStore from "../store/useLearnStore";
import { useBtnStore, useMotionDetectionStore } from "../store/useMotionStore";
import SectionButtonList from "../components/ButtonList/SectionButtonList";
import MotionCamera from "../components/motion/MotionCamera";
import VideoMotionButton from "../components/button/VideoMotionButton";

const LearnPage = () => {
  type LearnState = "LOADING" | "PAUSE" | "READY" | "PLAY";

  const leftSectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const video = videoRef.current;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const interval = intervalRef.current;

  const navigate = useNavigate();

  const [state, setState] = useState<LearnState>("LOADING");
  const [videoInfo, setVideoInfo] = useState({ id: 0, url: "", length: 0 });
  const [sectionList, setSectionList] = useState<VideoSection[]>([]);
  const [cameraSize, setCameraSize] = useState({ width: 0, height: 0 });

  const [currentTime, setCurrentTime] = useLearnStore((state) => [
    state.currentTime,
    state.setCurrentTime,
  ]);

  const [timer, resetTimer, countdownTimer] = useLearnStore((state) => [
    state.timer,
    state.resetTimer,
    state.countdownTimer,
  ]);

  const [isLooping, loopSection, setIsLooping, setLoopSection] = useLearnStore((state) => [
    state.isLooping,
    state.loopSection,
    state.setIsLooping,
    state.setLoopSection,
  ]);

  const [isFlipped, setIsFlipped] = useLearnStore((state) => [state.isFlipped, state.setIsFlipped]);

  const [playSpeed, changePlaySpeed] = useLearnStore((state) => [
    state.playSpeed,
    state.changePlaySpeed,
  ]);

  const currentSection = useLearnStore((state) => state.currentSection);

  const btn = useBtnStore((state) => state.btn);

  const [playCount, challengeCount, repeatCount, flipCount, speedCount] = useMotionDetectionStore(
    (state) => [
      state.playCount,
      state.challengeCount,
      state.repeatCount,
      state.flipCount,
      state.speedCount,
    ]
  );

  // 영상 정보 가져오기
  const loadVideo = useCallback(async () => {
    const data = await getShortsInfo(1);
    if (data) {
      setVideoInfo(data);
      initSectionList(data.length);
    }
  }, []);

  // 구간 리스트 초기화
  const initSectionList = (videoLength: number) => {
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

    setSectionList(result);
  };

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

  // 영상 시간 옮기기
  const moveVideoTime = useCallback(
    (startTime: number) => {
      if (video) {
        video.currentTime = startTime;
        setCurrentTime(startTime);
      }
    },
    [setCurrentTime, video]
  );

  // 타이머 인터벌 초기화
  const initInterval = useCallback(() => {
    if (interval) clearInterval(interval);
    intervalRef.current = null;
    resetTimer();
  }, [interval, resetTimer]);

  // 카운트다운 시작
  const startCountdown = useCallback(() => {
    if (interval) initInterval();
    intervalRef.current = setInterval(countdownTimer, 1000);
    setState("READY");
  }, [countdownTimer, initInterval, interval]);

  // 영상 재생
  const playVideo = useCallback(() => {
    if (video) {
      video.play();
      setState("PLAY");
    }
  }, [video]);

  // 영상 일시정지
  const pauseVideo = useCallback(() => {
    if (video) {
      video.pause();
      moveVideoTime(currentSection.start); // 현재 구간 시작 시간으로 이동
      setState("PAUSE");
    }
  }, [currentSection.start, moveVideoTime, video]);

  // 카운트다운이 끝나면 영상 재생
  useEffect(() => {
    if (interval && timer <= 0) {
      initInterval();
      playVideo();
    }
  }, [initInterval, interval, playVideo, timer]);

  // 컴포넌트가 처음 마운트될 때 실행
  useEffect(() => {
    loadVideo();
    initVideoSize();

    window.addEventListener("resize", initVideoSize);
    return () => window.removeEventListener("resize", initVideoSize);
  }, [loadVideo]);

  // 화면의 준비가 모두 완료했을 때 실행
  useEffect(() => {
    if (state === "LOADING") {
      if (videoInfo && sectionList && cameraSize) {
        initInterval();
        setState("PAUSE");
      }
    }
  }, [cameraSize, initInterval, sectionList, state, videoInfo]);

  // 영상의 현재 시간을 갱신, 반복인 경우 현재 시간 이전으로 되돌아가기
  const handleTimeUpdate = useCallback(() => {
    if (video) {
      setCurrentTime(video.currentTime);

      if (isLooping && loopSection) {
        if (video.currentTime >= loopSection.end || video.ended) {
          video.currentTime = loopSection.start;
          setCurrentTime(video.currentTime);
        }
      }
    }
  }, [isLooping, loopSection, setCurrentTime, video]);

  // 영상에 timeupdate 이벤트 추가
  useEffect(() => {
    if (video) video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      if (video) video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [handleTimeUpdate, video]);

  // 영상 버튼 정보 가져오기
  useEffect(() => {
    setBtnInfo();
  }, [cameraSize.width]);

  // 구간 반복 토글
  const toggleLooping = () => {
    if (isLooping) {
      setIsLooping(false);
      setLoopSection(null);
    } else {
      setIsLooping(true);
      setLoopSection(currentSection);
    }
  };

  useEffect(() => {
    console.log(btn);
    switch (btn) {
      case "play":
        if (state === "PAUSE") startCountdown();
        else pauseVideo();
        break;
      case "challenge":
        navigate("/challenge");
        break;
      case "repeat":
        toggleLooping();
        break;
      case "flip":
        setIsFlipped(!isFlipped);
        break;
      case "speed":
        changePlaySpeed();
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [btn]);

  return (
    <Container>
      {state === "LOADING" ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            color: "white",
          }}
        >
          Loading...
        </div>
      ) : (
        <>
          <LeftSection ref={leftSectionRef}>
            <SectionButtonList
              sectionList={sectionList}
              parentWidth={getComponentSize(leftSectionRef.current).width}
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
                    onClick={startCountdown}
                    progress={playCount}
                  />
                ) : (
                  <VideoMotionButton
                    id="play"
                    icon={<Pause />}
                    toolTip="일시정지"
                    onClick={pauseVideo}
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
                      onClick={toggleLooping}
                      progress={repeatCount}
                    />
                  ) : (
                    <VideoMotionButton
                      id="repeat"
                      imgSrc="src/assets/icon/repeat-off.svg"
                      toolTip="구간 반복"
                      onClick={toggleLooping}
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
                    text={`${playSpeed}x`}
                    toolTip="재생 속도"
                    onClick={changePlaySpeed}
                    progress={speedCount}
                  />
                </div>
              </VideoMotionButtonList>
              {state === "READY" && <Timer>{timer}</Timer>}
            </VideoContainer>
          </CenterSection>
          <RightSection></RightSection>
        </>
      )}
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
  position: relative;
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

const VideoMotionButtonList = styled.div`
  position: absolute;
  top: 0;
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

export default LearnPage;
