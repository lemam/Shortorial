import { useCallback, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import danceVideo from "../assets/sample.mp4";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import LoadingModalComponent from "../components/modal/LoadingModalComponent";
import { predictWebcam, setBtnInfo } from "../modules/Motion";
import { DrawingUtils, NormalizedLandmark } from "@mediapipe/tasks-vision";
import { useBtnStore, useMotionDetectionStore } from "../store/useMotionStore";
import VideoMotionButton from "../components/button/VideoMotionButton";
import {
  Flip,
  RadioButtonChecked,
  TimerRounded,
  DirectionsRun,
  DoDisturb,
  Save,
  Movie,
} from "@mui/icons-material";
import { postUploadShorts } from "../apis/shorts";

const ChallengePage = () => {
  const navigate = useNavigate();
  const ffmpeg = createFFmpeg({ log: false });

  const userVideoRef = useRef<HTMLVideoElement>(null);
  const danceVideoRef = useRef<HTMLVideoElement>(null);

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [show, setShow] = useState(false);
  const [recording, setRecording] = useState(false); // 녹화 진행
  const initialTimer = parseInt(localStorage.getItem("timer") || "3");
  const [timer, setTimer] = useState<number>(initialTimer); // 타이머
  const [loadPath, setLoadPath] = useState("src/assets/challenge/loading.gif"); // 로딩 이미지 경로
  const [ffmpegLog, setFfmpegLog] = useState("");
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  type LearnState = "RECORD" | "READY";
  const [state, setState] = useState<LearnState>("READY");

  const { visibleCount, timerCount, recordCount, learnCount, resultCount } =
    useMotionDetectionStore();

  const handleShowModal = () => {
    setShow(true); // 모달 열기
    stopRecording();
  };
  const handleCloseModal = () => setShow(false);
  const showRecordButton = () => setRecording(false);
  const showCancelButton = () => setRecording(true); // 타이머 useEffect 시작

  const goToLearnMode = () => {
    stream?.getTracks().forEach((track) => track.stop());
    navigate("/learn");
  };
  const goToResult = () => {
    stream?.getTracks().forEach((track) => track.stop());
    navigate("/challenge/result");
  };

  const changeTimer = () => {
    const nextTimer = timer == 3 ? 5 : timer == 5 ? 10 : 3;

    localStorage.setItem("timer", nextTimer.toString());
    setTimer(nextTimer);
  };

  const cancelRecording = () => {
    setState("READY");
    showRecordButton();
    if (danceVideoRef.current) {
      danceVideoRef.current.pause();
      danceVideoRef.current.currentTime = 0;
    }
  };

  const stopRecording = () => {
    setLoadPath("src/assets/challenge/loading.gif");
    setFfmpegLog("대기중...");
    cancelRecording();
    mediaRecorder?.stop(); // recorder.onstop() 실행
  };

  const startRecording = () => {
    setState("RECORD");

    if (!stream) {
      alert("카메라 접근을 허용해주세요.");
      return;
    }

    try {
      const recorder = new MediaRecorder(stream); // 녹화형으로 변환
      const chunks: BlobPart[] = []; // 스트림 조각을 넣을 배열
      recorder.ondataavailable = (e) => chunks.push(e.data); // 스트림 조각이 어느 정도 커지면 push하기

      recorder.onstop = async () => {
        if (!ffmpeg.isLoaded()) {
          await ffmpeg.load(); // ffmpeg 로드
        }

        const userVideoBlob = new Blob(chunks, { type: "video/mp4" }); // Blob 생성

        // 댄스 비디오 오디오 추출
        const danceVideoBlob = await fetchFile(danceVideo); // 링크된 댄스 비디오를 Blob으로 변환
        ffmpeg.FS("writeFile", "danceVideo.mp4", danceVideoBlob); // Blob을 가상 파일로 변환

        ffmpeg.setProgress(({ ratio }) => {
          if (ratio > 0) {
            setLoadPath("src/assets/challenge/loading.gif");
            setFfmpegLog(`노래 추출... ${Math.round(ratio * 100)}%\n`);
          }
        });

        await ffmpeg.run(
          "-i",
          "danceVideo.mp4",
          "-vn", // 비디오 무시
          "-c:a",
          "copy", // aac 코덱 복사
          "dance_audio.m4a" // 오디오 파일 생성
        );

        // 비디오에 오디오 추가
        await addAudio(userVideoBlob);
      };

      recorder.start(); // 녹화 시작
      setMediaRecorder(recorder);
      danceVideoRef.current?.play(); // 댄스 비디오 시작
    } catch (error) {
      console.log(error);
      alert("녹화를 다시 시작해 주세요.");
    }
  };

  const addAudio = async (userVideoBlob: Blob) => {
    try {
      const reader = new FileReader();
      reader.readAsArrayBuffer(userVideoBlob);
      // 파일 읽기가 완료 되면
      reader.onloadend = async () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer); // ffmpeg가 읽을 수 있는 8비트 정수 배열로 변환
        ffmpeg.FS("writeFile", "userVideo.mp4", uint8Array); // 사용자 비디오 가상 파일 만들기

        ffmpeg.setProgress(({ ratio }) => {
          if (ratio > 0) {
            setLoadPath("src/assets/challenge/loading.gif");
            setFfmpegLog(`노래 삽입... ${Math.round(ratio * 100)}%\n`);
          }
        });

        await ffmpeg.run(
          "-i",
          "userVideo.mp4", // 사용자 영상
          "-i",
          "dance_audio.m4a", // 원본 오디오
          "-map",
          "0:v:0", // 첫번째 파일(사용자 영상)의 0번째 스트림
          "-map",
          "1:a:0", // 두번째 파일(원본 오디오)의 0번째 스트림
          "-c:v",
          "copy", // 비디오 인코딩 복사
          "-c:a",
          "copy", // 오디오 인코딩 복사
          "-shortest", // 두 개 파일 중 짧은 쪽에 맞춤
          "finalUserVideo.mp4" // 파일 생성
        );

        ffmpeg.setProgress(({ ratio }) => {
          if (ratio > 0) {
            setLoadPath("src/assets/challenge/loading.gif");
            setFfmpegLog(`거울모드로 저장... ${Math.round(ratio * 100)}%\n`);
          }
        });

        await ffmpeg.run(
          "-i",
          "finalUserVideo.mp4",
          "-vf", // 비디오 필터
          "hflip", // 좌우반전
          "finalUserVideoFlip.mp4"
        );

        const userVideoFlipFinal = ffmpeg.FS("readFile", "finalUserVideoFlip.mp4");
        // 최종 파일 Blob 변환
        const userVideoFinalBlob = new Blob([userVideoFlipFinal.buffer], {
          type: "video/mp4",
        });

        // 최종파일 url 전달
        makeDownloadURL(userVideoFinalBlob);
      };
    } catch (error) {
      console.log(error);
      alert("오디오를 추가할 수 없습니다.");
    }
  };

  const makeDownloadURL = async (userVideoFinalBlob: Blob) => {
    try {
      await s3Upload(userVideoFinalBlob);
      setTimeout(handleCloseModal, 2000);
    } catch (error) {
      console.error("비디오 저장 중 오류 발생:", error);
    }
  };

  const s3Upload = async (blob: Blob) => {
    try {
      const title = getCurrentDateTime();
      // const formData = new FormData();
      // formData.append("file", blob, `${title}.mp4`);
      // formData.append("fileName", title);

      const uploadResponse = await postUploadShorts(blob, title);

      setLoadPath("src/assets/challenge/complete.svg");
      setFfmpegLog("저장 완료");
      console.log("s3 upload success", uploadResponse.data);
    } catch (error) {
      setLoadPath("src/assets/challenge/uncomplete.svg");
      //if (error instanceof Error && error.stack) setFfmpegLog(error.stack);
      setFfmpegLog("저장 실패");
      console.error("s3 upload fail", error);
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더합니다.
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  };

  // 타이머
  useEffect(() => {
    if (recording) {
      // 녹화 시작 버튼을 눌렀을 때
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(intervalId); // 인터벌 종료
            startRecording(); // 녹화 시작
            return initialTimer; // 로컬스토리지에 저장된 타이머값으로 초기화
          }
          return prevTimer - 1; // timer에 저장된 값에서 1을 뺌
        });
      }, 1000); // 1초에 한번씩

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [recording]);

  const canvasElement = document.getElementById("output_canvas") as HTMLCanvasElement | null;
  let canvasCtx: CanvasRenderingContext2D | null = null;
  // 그리기 도구
  let drawingUtils: DrawingUtils | null = null;

  if (canvasElement) canvasCtx = canvasElement.getContext("2d");
  if (canvasCtx) drawingUtils = new DrawingUtils(canvasCtx);

  const lastWebcamTime = -1;
  const before_handmarker: NormalizedLandmark | null = null;
  const curr_handmarker: NormalizedLandmark | null = null;

  // camera가 있을 HTML
  const setInit = useCallback(async () => {
    const constraints: MediaStreamConstraints = {
      video: {
        aspectRatio: 9 / 16,
      },
      audio: false,
    };

    try {
      // 카메라 불러오기
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      // userVideoRef를 참조하고 있는 DOM에 넣기
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        userVideoRef.current.addEventListener("loadeddata", () => {
          console.log("이벤트 삽입 완");
          predictWebcam(
            "challenge",
            userVideoRef.current,
            canvasCtx,
            canvasElement,
            drawingUtils,
            lastWebcamTime,
            before_handmarker,
            curr_handmarker,
            setBtn
          );
        });
      }
    } catch (error) {
      alert("카메라 접근을 허용해주세요.");
      console.log(error);
    }

    // setInit();
  }, []);

  // 비디오 크기 초기화
  const initVideoSize = (videoRef: React.RefObject<HTMLVideoElement>) => {
    if (videoRef.current) {
      videoRef.current.height = window.innerHeight;
      videoRef.current.width = Math.floor((videoRef.current.height * 9) / 16);
    }
  };

  useEffect(() => {
    setInit(); // 카메라 초기화
    initVideoSize(danceVideoRef);
    initVideoSize(userVideoRef);

    (() => {
      // 화면 크기가 바뀔 때 영상과 카메라 크기도 재설정
      window.addEventListener("orientationchange", () => {
        setTimeout(() => initVideoSize(danceVideoRef), 200);
      });
      window.addEventListener("orientationchange", () => {
        setTimeout(() => initVideoSize(userVideoRef), 200);
      });
    })();

    return () => {
      window.removeEventListener("orientationchange", () => initVideoSize(userVideoRef));
      window.removeEventListener("orientationchange", () => initVideoSize(danceVideoRef));
    };
  }, []);

  const { btn, setBtn } = useBtnStore();

  useEffect(() => {
    switch (btn) {
      case "visible":
        console.log("record");
        if (state === "READY") {
          showCancelButton();
        } else {
          cancelRecording();
        }
        break;
      case "timer":
        console.log("timer");
        if (state === "READY") {
          changeTimer();
        } else {
          handleShowModal();
        }
        break;
      case "record":
        console.log("flip");
        setIsFlipped(!isFlipped);
        break;
      case "learn":
        console.log("learn");
        goToLearnMode();
        break;
      case "rslt":
        console.log("result");
        goToResult();
        break;
    }
  }, [btn]);

  useEffect(() => {
    setBtnInfo();
  }, []);

  return (
    <ChallengeContainer>
      <VideoContainer
        ref={danceVideoRef}
        src={danceVideo}
        playsInline
        onEnded={handleShowModal}
        className={isFlipped ? "flip" : ""}
      ></VideoContainer>
      <UserContainer id="dom">
        <UserVideoContainer
          ref={userVideoRef}
          autoPlay
          playsInline
        ></UserVideoContainer>
        {state === "READY" ? (
          <Timer>{timer}</Timer>
        ) : (
          <Recording src="src/assets/challenge/recording.svg" />
        )}
        <VideoMotionButtonList>
          {state === "READY" ? (
            <div className="foldList">
              <VideoMotionButton
                icon={<RadioButtonChecked />}
                toolTip="녹화"
                onClick={showCancelButton}
                id="visible"
                progress={visibleCount}
              />
              <VideoMotionButton
                icon={<TimerRounded />}
                toolTip="타이머"
                onClick={changeTimer}
                id="timer"
                progress={timerCount}
              />
              <VideoMotionButton
                icon={<Flip />}
                toolTip="거울 모드"
                onClick={() => setIsFlipped(!isFlipped)}
                id="record"
                progress={recordCount}
              />
              <VideoMotionButton
                icon={<DirectionsRun />}
                toolTip="연습 모드로 이동"
                onClick={goToLearnMode}
                id="learn"
                progress={learnCount}
              />
              <VideoMotionButton
                icon={<Movie />}
                toolTip="결과 확인"
                onClick={goToResult}
                id="rslt"
                progress={resultCount}
              />
            </div>
          ) : (
            <div className="foldList">
              <VideoMotionButton
                icon={<DoDisturb />}
                toolTip="취소"
                onClick={cancelRecording}
                id="visible"
                progress={visibleCount}
              />
              <VideoMotionButton
                icon={<Save />}
                toolTip="저장"
                onClick={handleShowModal}
                id="timer"
                progress={recordCount}
              />
            </div>
          )}
        </VideoMotionButtonList>
      </UserContainer>
      <LoadingModalComponent
        progress={ffmpegLog}
        showModal={show}
        handleCloseModal={handleCloseModal}
        path={loadPath}
      ></LoadingModalComponent>
    </ChallengeContainer>
  );
};

const VideoContainer = styled.video`
  position: relative;
  display: none;

  &.flip {
    transform: scaleX(-1);
  }

  @media screen and (min-width: 1024) {
    display: flex;
  }

  @media screen and (orientation: landscape) {
    display: flex;
  }
`;

const UserContainer = styled.div`
  position: relative;
`;

const UserVideoContainer = styled.video`
  position: relative;
  display: flex;

  object-fit: cover;
  transform: scaleX(-1);
`;

const ChallengeContainer = styled.div`
  display: flex;
  background-color: black;
  justify-content: center;
`;

const blinkEffect = keyframes`
  50% {
    opacity: 0;
`;

const Recording = styled.img`
  position: absolute;
  left: 5%;
  top: 4%;
  width: 15px;
  height: 15px;
  z-index: 1;
  animation: ${blinkEffect} 1s step-end infinite;
`;

const Timer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  font-size: 130px;
`;

const VideoMotionButtonList = styled.div`
  position: absolute;
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

export default ChallengePage;
