import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Videocam } from "@mui/icons-material";
import IconButton from "../components/button/IconButton";
import SectionButton from "../components/button/SectionButton";
import useLearnVideoStore, {
  useLearnVideoFetch,
  useLearnVideoComputed,
  useLearnVideoActions,
} from "../store/useLearnVideoStore";
import { VideoSection } from "../constants/types";

const LearnPageTest = () => {
  const cameraRef = useRef<HTMLVideoElement>(null);
  const [leftSectionWidth, setLeftSectionWidth] = useState<number>(0);

  const [cameraSize, setCameraSize] = useState({
    width: 0,
    height: 0,
  });

  const { videoRef, sectionList, isLoop } = useLearnVideoStore();
  const { fetchSectionList } = useLearnVideoFetch();
  const { currentSection } = useLearnVideoComputed();
  const { setCurrentTime, moveVideoTime, setIsLoop, loopVideoSetion, setLoopSection } =
    useLearnVideoActions();

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

  // 동영상의 현재 시간이 변경될 때 발생하는 이벤트 리스너
  const handleTimeUpdate = useCallback(() => {
    // 동영상의 현재 시간을 업데이트한다.
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);

    // 구간 반복
    if (isLoop) loopVideoSetion();
  }, [isLoop, videoRef, loopVideoSetion, setCurrentTime]);

  // Section Button 클릭 이벤트 리스너
  const handleClickSectionButton = (section: VideoSection) => {
    moveVideoTime(section.start);
    setCurrentTime(section.start);
    if (isLoop) setLoopSection(section);
  };

  // Loop Button 클릭 이벤트 리스너
  const handleClickLoopButton = () => {
    const doLooping = !isLoop;

    if (doLooping) setLoopSection(currentSection());
    else setLoopSection(null);

    setIsLoop(doLooping);
  };

  // 상태 초기화
  useEffect(() => {
    initCamera();
    initVideoSize();
    fetchSectionList();
  }, [fetchSectionList, initCamera]);

  // window에 resize event 추가
  // 동영상에 timeupdate event 추가
  useEffect(() => {
    window.addEventListener("resize", initVideoSize);

    const video = videoRef.current;
    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      window.removeEventListener("resize", initVideoSize);

      if (video) {
        video.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [handleTimeUpdate, videoRef]);

  return (
    <Container>
      <LeftSection ref={(el) => measuredRef(el)}>
        <SectionButtonList>
          {sectionList?.map((section) => {
            return (
              <SectionButton
                key={section.id}
                time={section.start}
                isSmall={leftSectionWidth < 100}
                active={section.id === currentSection().id}
                onClick={() => handleClickSectionButton(section)}
              ></SectionButton>
            );
          })}
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
            <button style={{ background: "#fff" }} onClick={handleClickLoopButton}>
              {isLoop ? "루프 중" : "루프 안하는 중"}
            </button>
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
