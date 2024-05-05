import { useCallback, useRef, useState, useEffect } from "react";
import styled from "styled-components";
import danceVideo from "../assets/sample.mp4";
import { useNavigate } from "react-router-dom";
import useChallengeStore from "../store/useChallengeStore";
import load from "../assets/loading.gif";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import ModalComponent from "../components/ModalComponent";
import VideoButton from "../components/button/VideoButton";

const ChallengePage = () => {
  const navigate = useNavigate();
  const ffmpeg = createFFmpeg({ log: false });

  const { setDownloadURL } = useChallengeStore();
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const danceVideoRef = useRef<HTMLVideoElement>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState(false);
  const [timer, setTimer] = useState(3);
  const [timerPath, setTimerPath] = useState(`src/assets/challenge/${timer}sec.svg`);

  const handleShowModal = () => setLoading(true);
  const handleCloseModal = () => setLoading(false);
  const showVideoButtonContainer = () => setIsVisible(!isVisible);

  const changeTimer = () => {
    const nextTimer = timer === 3 ? 5 : timer === 5 ? 10 : 3;
    setTimer(nextTimer);
    setTimerPath(`src/assets/challenge/${nextTimer}sec.svg`);
  };

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
      if (userVideoRef.current) userVideoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
    } catch (error) {
      alert("카메라 접근을 허용해주세요.");
      console.log(error);
    }
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

  const startRecording = () => {
    if (!stream) {
      alert("카메라 접근을 허용해주세요.");
      return;
    }

    try {
      ffmpeg.load(); // ffmpeg 로드
      const recorder = new MediaRecorder(stream); // 녹화형으로 변환
      const chunks: BlobPart[] = []; // 스트림 조각을 넣을 배열
      recorder.ondataavailable = (e) => chunks.push(e.data); // 스트림 조각이 어느 정도 커지면 push하기

      recorder.onstop = async () => {
        handleShowModal(); // 로딩창 띄우기

        const userVideoBlob = new Blob(chunks, { type: "video/mp4" }); // Blob 생성

        // 댄스 비디오 오디오 추출
        const danceVideoBlob = await fetchFile(danceVideo); // 링크된 댄스 비디오를 Blob으로 변환
        ffmpeg.FS("writeFile", "danceVideo.mp4", danceVideoBlob); // Blob을 가상 파일로 변환
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

      setTimeout(() => {
        recorder.start(); // 녹화 시작
        setMediaRecorder(recorder);

        danceVideoRef.current?.play(); // 댄스 비디오 시작
      }, timer * 1000);
    } catch (error) {
      console.log(error);
      alert("녹화를 다시 시작해 주세요.");
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop(); // recorder.onstop() 실행
    stream?.getTracks().forEach((track) => track.stop());
  };

  const goToList = () => {
    navigate("/");
  };

  const goToLearnMode = () => {
    navigate("/learn"); // 연습 페이지 가기
  };

  const goToChallengeMode = () => {
    navigate("/challenge"); // 다시 찍기
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

  const makeDownloadURL = (userVideoFinalBlob: Blob) => {
    try {
      setDownloadURL(URL.createObjectURL(userVideoFinalBlob));
    } catch (error) {
      console.log("비디오가 생성되지 않았습니다:", error);
    } finally {
      handleCloseModal(); // 모달 닫기
      //avigate("/challenge/result"); // 결과 페이지 가기
    }
  };

  return (
    <ChallengeContainer>
      <VideoContainer
        ref={danceVideoRef}
        src={danceVideo}
        playsInline
        onEnded={stopRecording}
      ></VideoContainer>
      <div style={{ position: "relative" }}>
        <UserVideoContainer ref={userVideoRef} autoPlay playsInline></UserVideoContainer>
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
        <VideoButtonContainer>
          <VideoButton
            path={timerPath}
            text="타이머"
            isVisible={isVisible}
            onClick={changeTimer}
          ></VideoButton>
          {mediaRecorder && (
            <VideoButton
              path="src/assets/challenge/stop.svg"
              text="취소"
              onClick={stopRecording}
              isVisible={isVisible}
            ></VideoButton>
          )}
          {!mediaRecorder && (
            <VideoButton
              path="src/assets/challenge/record.svg"
              text="녹화"
              onClick={startRecording}
              isVisible={isVisible}
            ></VideoButton>
          )}
          <VideoButton
            path="src/assets/challenge/save.svg"
            text="임시저장"
            isVisible={isVisible}
          ></VideoButton>
          <VideoButton
            path="src/assets/challenge/learn.svg"
            text="연습모드"
            onClick={goToLearnMode}
            isVisible={isVisible}
          ></VideoButton>
          <VideoButton
            path="src/assets/challenge/exit.svg"
            text="나가기"
            onClick={goToList}
            isVisible={isVisible}
          ></VideoButton>
        </VideoButtonContainer>
      </div>
      <ModalComponent
        title="아픈 건 딱 질색이니까"
        body={<img src={load} width="300px" height="300px"></img>}
        showModal={loading}
        handleCloseModal={handleCloseModal}
        goToLearnMode={goToLearnMode}
        goToChallengeMode={goToChallengeMode}
      ></ModalComponent>
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
  top: 115px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 100;
  min-width: 120px;
`;

export default ChallengePage;
