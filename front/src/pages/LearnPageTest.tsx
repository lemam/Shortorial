import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import IconButton from "../components/button/IconButton";
import { Pause, PlayArrow } from "@mui/icons-material";

const LearnPageTest = () => {
  type LearnState = "PAUSE" | "READY" | "PLAY";

  const cameraRef = useRef<HTMLVideoElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const video = videoRef.current;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [state, setState] = useState<LearnState>("PAUSE");
  const [cameraSize, setCameraSize] = useState({
    width: 0,
    height: 0,
  });

  const [timer] = useState(3);
  const [currTimer, setCurrTimer] = useState(timer);

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

  // 타이머 초기화
  const initInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setCurrTimer(timer);
  }, [timer]);

  // PAUSE 상태로 변경
  const changeStatePause = useCallback(() => {
    // 타이머 중지한다.
    // 동영상 중지 후 처음으로 돌아간다.
    if (video) {
      initInterval();
      video.pause();
      video.currentTime = 0;
    }
    setState("PAUSE");
  }, [initInterval, video]);

  // READY 상태로 변경
  const changeStateReady = () => {
    // 타이머 1초씩 카운트다운
    intervalRef.current = setInterval(() => setCurrTimer((prev) => prev - 1), 1000);
    setState("READY");
  };

  // PLAY 상태로 변경
  const changeStatePlay = useCallback(() => {
    // 동영상 재생
    if (video) video.play();
    setState("PLAY");
  }, [video]);

  // 카메라 초기화
  useEffect(() => {
    initCamera();
    initVideoSize();

    window.addEventListener("resize", initVideoSize);

    return () => {
      window.removeEventListener("resize", initVideoSize);
    };
  }, [initCamera]);

  // 타이머 감시
  useEffect(() => {
    // 카운트다운이 끝나면 재생 상태로 변경
    if (currTimer <= 0) {
      initInterval();
      changeStatePlay();
    }
  }, [changeStatePlay, currTimer, initInterval]);

  // 동영상 감시
  useEffect(() => {
    if (video) video.addEventListener("ended", changeStatePause);

    return () => {
      if (video) video.removeEventListener("ended", changeStatePause);
    };
  }, [changeStatePause, video]);

  return (
    <Container>
      <Timer>{state}</Timer>
      <LeftSection></LeftSection>
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
          <div>
            <div>
              {state === "PAUSE" ? (
                <IconButton icon={<PlayArrow />} text="재생" onClick={changeStateReady} />
              ) : (
                <IconButton icon={<Pause />} text="일시정지" onClick={changeStatePause} />
              )}
            </div>
          </div>
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
    object-fit: cover;
  }

  @media screen and (max-width: 479px) {
    .camera {
      display: none;
    }
  }
`;

const Timer = styled.div`
  position: absolute;
  color: #fff;
`;

export default LearnPageTest;
