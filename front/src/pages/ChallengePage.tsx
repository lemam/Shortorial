import { useCallback, useRef, useState, useEffect } from "react";
import styled from "styled-components";
import danceVideo from "../assets/sample.mp4";
import { useNavigate } from "react-router-dom";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import LoadingModalComponent from "../components/modal/LoadingModalComponent";
import VideoButton from "../components/button/VideoButton";
import axios from "axios";
import { predictWebcam } from "../modules/Motion";
import { DrawingUtils, NormalizedLandmark } from "@mediapipe/tasks-vision";
import { useVisibleStore, useTimerStore } from "../store/useMotionStore";

const ChallengePage = () => {
  const navigate = useNavigate();
  const ffmpeg = createFFmpeg({ log: false });
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const danceVideoRef = useRef<HTMLVideoElement>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [show, setShow] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // 토글
  const [recording, setRecording] = useState(false); // 녹화 진행
  const initialTimer = parseInt(localStorage.getItem("timer") || "3");
  const [timer, setTimer] = useState<number>(initialTimer);
  const [timerPath, setTimerPath] = useState(
    `src/assets/challenge/${timer}sec.svg`
  );
  const [ffmpegLog, setFfmpegLog] = useState("");

  const handleShowModal = () => {
    setShow(true);
    stopRecording();
  };
  const handleCloseModal = () => setShow(false);

  const showVideoButtonContainer = () => setIsVisible(!isVisible);
  const showRecordButton = () => setRecording(false);
  const showCancleButton = () => setRecording(true);

  const goToLearnMode = () => {
    stream?.getTracks().forEach((track) => track.stop());
    navigate("/learn");
  };
  const goToResult = () => {
    stream?.getTracks().forEach((track) => track.stop());
    navigate("/challenge/result");
  };

  const changeTimer = () => {
    var nextTimer = timer == 3 ? 5 : timer == 5 ? 10 : 3;

    localStorage.setItem("timer", nextTimer.toString());
    setTimer(nextTimer);
    setTimerPath(`src/assets/challenge/${nextTimer}sec.svg`);
  };

  const cancelRecording = () => {
    showRecordButton();
    if (danceVideoRef.current) {
      danceVideoRef.current.pause();
      danceVideoRef.current.currentTime = 0;
    }
  };

  const stopRecording = () => {
    cancelRecording();
    mediaRecorder?.stop(); // recorder.onstop() 실행
  };

  const startRecording = () => {
    if (!stream) {
      alert("카메라 접근을 허용해주세요.");
      return;
    }

    try {
      const recorder = new MediaRecorder(stream); // 녹화형으로 변환
      const chunks: BlobPart[] = []; // 스트림 조각을 넣을 배열
      recorder.ondataavailable = (e) => chunks.push(e.data); // 스트림 조각이 어느 정도 커지면 push하기

      recorder.onstop = async () => {
        //handleShowModal(); // 로딩창 띄우기
        //setDownload(true);

        if (!ffmpeg.isLoaded()) {
          await ffmpeg.load(); // ffmpeg 로드
        }

        const userVideoBlob = new Blob(chunks, { type: "video/mp4" }); // Blob 생성

        // 댄스 비디오 오디오 추출
        const danceVideoBlob = await fetchFile(danceVideo); // 링크된 댄스 비디오를 Blob으로 변환
        ffmpeg.FS("writeFile", "danceVideo.mp4", danceVideoBlob); // Blob을 가상 파일로 변환

        ffmpeg.setProgress(({ ratio }) => {
          if (ratio > 0) {
            setFfmpegLog(`노래 추출 중 : ${Math.round(ratio * 100)}%\n`);
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
            setFfmpegLog(`노래 삽입 중 : ${Math.round(ratio * 100)}%\n`);
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
            setFfmpegLog(`비디오 방향 전환 중 : ${Math.round(ratio * 100)}%\n`);
          }
        });

        await ffmpeg.run(
          "-i",
          "finalUserVideo.mp4",
          "-vf", // 비디오 필터
          "hflip", // 좌우반전
          "finalUserVideoFlip.mp4"
        );

        const userVideoFlipFinal = ffmpeg.FS(
          "readFile",
          "finalUserVideoFlip.mp4"
        );
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
      await s3Upload(URL.createObjectURL(userVideoFinalBlob), new Date());
      setTimeout(handleCloseModal, 2000);
    } catch (error) {
      console.error("비디오 저장 중 오류 발생:", error);
    }
  };

  const s3Upload = async (url: string, title: Date) => {
    try {
      const response = await axios.get(url, { responseType: "blob" });
      const file = new File([response.data], `${title.toISOString()}.mp4`, {
        type: "video/mp4",
      });
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", title.toISOString());

      const uploadResponse = await axios.post(
        "http://localhost:8080/s3/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InN0cmluZyIsImlhdCI6MTcxNTAwNjIyMiwiZXhwIjoxNzE1MDA4MDIyfQ.x1MaVyGOu5IBQyXAlod8OH50I07kmHL_IpSQfDnL8x0",
          },
        }
      );
      setFfmpegLog("저장 완료");
      console.log("s3 upload success", uploadResponse.data);
    } catch (error) {
      setFfmpegLog("저장 실패");
      console.error("s3 upload fail", error);
    }
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

  const canvasElement = document.getElementById(
    "output_canvas"
  ) as HTMLCanvasElement | null;
  let canvasCtx: CanvasRenderingContext2D | null = null;
  // 그리기 도구
  let drawingUtils: DrawingUtils | null = null;

  if (canvasElement) canvasCtx = canvasElement.getContext("2d");
  if (canvasCtx) drawingUtils = new DrawingUtils(canvasCtx);

  let lastWebcamTime = -1;
  let before_handmarker: NormalizedLandmark | null = null;
  let curr_handmarker: NormalizedLandmark | null = null;

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
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      // userVideoRef를 참조하고 있는 DOM에 넣기
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        userVideoRef.current.addEventListener("loadeddata", () => {
          console.log("이벤트 삽입 완");
          predictWebcam(
            userVideoRef.current,
            canvasCtx,
            canvasElement,
            drawingUtils,
            lastWebcamTime,
            before_handmarker,
            curr_handmarker,
            setVisibleBtn,
            setTimerBtn
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
      window.removeEventListener("orientationchange", () =>
        initVideoSize(userVideoRef)
      );
      window.removeEventListener("orientationchange", () =>
        initVideoSize(danceVideoRef)
      );
    };
  }, []);

  const { visibleBtn, setVisibleBtn } = useVisibleStore();
  const { timerBtn, setTimerBtn } = useTimerStore();
  useEffect(() => {
    showVideoButtonContainer();
  }, [visibleBtn]);

  useEffect(() => {
    if (isVisible) {
      changeTimer();
    } else {
      setTimerBtn(!timerBtn);
    }
  }, [timerBtn]);

  return (
    <ChallengeContainer>
      <VideoContainer
        ref={danceVideoRef}
        src={danceVideo}
        playsInline
        controls
        onEnded={handleShowModal}
      ></VideoContainer>
      <div style={{ position: "relative" }}>
        <UserVideoContainer
          ref={userVideoRef}
          autoPlay
          playsInline
        ></UserVideoContainer>
        {/* <canvas
          id="output_canvas"
          width={500}
          height={700}
          style={{ objectFit: "cover" }}
        ></canvas> */}
        <VideoToggleContainer>
          <VideoButton
            path="src/assets/challenge/open.svg"
            text="감추기"
            onClick={showVideoButtonContainer}
            isVisible={isVisible}
          ></VideoButton>
          <VideoButton
            path="src/assets/challenge/close.svg"
            text="보기"
            onClick={showVideoButtonContainer}
            isVisible={!isVisible}
          ></VideoButton>
        </VideoToggleContainer>
        <Timer>{timer}</Timer>
        <VideoButtonContainer>
          <VideoButton
            path={timerPath}
            text="타이머"
            isVisible={isVisible}
            onClick={changeTimer}
          ></VideoButton>
          <VideoButton
            path="src/assets/challenge/stop.svg"
            text="취소"
            onClick={cancelRecording}
            isVisible={isVisible && recording} // isVisible, recording 일 때 보임
          ></VideoButton>
          <VideoButton
            path="src/assets/challenge/record.svg"
            text="녹화"
            onClick={showCancleButton}
            isVisible={isVisible && !recording} // isVisible, not recording 일 때 보임
          ></VideoButton>
          <VideoButton
            path="src/assets/challenge/save.svg"
            text="저장"
            isVisible={isVisible}
            onClick={handleShowModal}
          ></VideoButton>
          <VideoButton
            path="src/assets/challenge/learn.svg"
            text="연습모드"
            onClick={goToLearnMode}
            isVisible={isVisible}
          ></VideoButton>
          <VideoButton
            path="src/assets/challenge/mine.svg"
            text="나의 챌린지"
            onClick={goToResult}
            isVisible={isVisible}
          ></VideoButton>
        </VideoButtonContainer>
      </div>
      <LoadingModalComponent
        progress={ffmpegLog}
        showModal={show}
        handleCloseModal={handleCloseModal}
      ></LoadingModalComponent>
    </ChallengeContainer>
  );
};

const VideoContainer = styled.video`
  position: relative;
  display: flex;
`;

const UserVideoContainer = styled.video`
  position: relative;
  display: none;

  @media screen and (min-width: 1024) {
    display: flex;
  }

  @media screen and (orientation: landscape) {
    display: flex;
  }
  object-fit: cover;
  transform: scaleX(-1);
`;

const ChallengeContainer = styled.div`
  display: flex;
  background-color: black;
  justify-content: center;
`;

const VideoToggleContainer = styled.div`
  position: absolute !important;
  right: 0 !important;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 1;
  min-width: 120px;
`;

const VideoButtonContainer = styled.div`
  position: absolute !important;
  right: 0 !important;
  top: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 1;
  min-width: 120px;
`;

const Timer = styled.div`
  position: absolute !important;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  font-size: 50px;
`;

export default ChallengePage;
