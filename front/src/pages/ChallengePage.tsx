import { useCallback, useRef, useState, useEffect } from "react";
import styled from "styled-components";
import danceVideo from "../assets/sample.mp4";
import { useNavigate } from "react-router-dom";
import useChallengeStore from "../store/useChallengeStore";
import learnMode from "../assets/learnmode.png";
import stop from "../assets/stop.png";
import start from "../assets/start.png";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
//import ffmpeg from "fluent-ffmpeg";

const ChallengePage = () => {
  const navigate = useNavigate();
  const ffmpeg = createFFmpeg({ log: true });

  const { setDownloadURL } = useChallengeStore();
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const danceVideoRef = useRef<HTMLVideoElement>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

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
      const recorder = new MediaRecorder(stream); // 녹화형으로 변환
      const chunks: BlobPart[] = []; // 스트림 조각을 넣을 배열
      recorder.ondataavailable = (e) => chunks.push(e.data); // 스트림 조각이 어느 정도 커지면 push하기

      recorder.onstop = async () => {
        const userVideoBlob = new Blob(chunks, { type: "video/mp4" }); // 현재 chunk배열에 있는 조각을 blob으로 만들기
        await ffmpeg.load();
        await addAudio(userVideoBlob);
      };

      recorder.start(); // 녹화 시작
      setMediaRecorder(recorder);

      danceVideoRef.current?.play(); // 댄스 비디오도 시작
    } catch (error) {
      console.log(error);
      alert("녹화를 다시 시작해 주세요.");
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop(); // recorder.onstop() 실행
    stream?.getTracks().forEach((track) => track.stop());
    navigate("/challenge/result"); // 결과 페이지 가기
  };

  const goToLearnMode = () => {
    navigate("/learn"); // 연습 페이지 가기
  };

  const addAudio = async (userVideoBlob: Blob) => {
    try {
      const danceVideoBlob = await fetchFile(danceVideo); // 링크된 댄스 비디오를 Blob으로 변환
      ffmpeg.FS("writeFile", "danceVideo.mp4", danceVideoBlob); // Blob을 가상 파일로 변환
      await ffmpeg.run("-i", "danceVideo.mp4", "dance_audio.mp3"); // 댄스 비디오 오디오 추출

      const reader = new FileReader();
      reader.readAsArrayBuffer(userVideoBlob);
      // 파일 읽기가 완료 되면
      reader.onloadend = async () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer); // ffmpeg가 읽을 수 있는 8비트 정수 배열로 변환
        ffmpeg.FS("writeFile", "userVideo.mp4", uint8Array); // 사용자 비디오 가상 파일 만들기

        await ffmpeg.run(
          "-i",
          "userVideo.mp4",
          "-i",
          "dance_audio.mp3",
          // "-c:v",
          // "copy",
          "-map",
          "0:v:0",
          "-map",
          "1:a:0",
          "-shortest",
          "-vf",
          "hflip",
          "finalUserVideo.mp4"
        );

        const userVideoFlipFinal = ffmpeg.FS("readFile", "finalUserVideo.mp4");
        // 최종 파일 Blob 변환
        const userVideoFinalBlob = new Blob([userVideoFlipFinal.buffer], {
          type: "video/mp4",
        });

        // 다운로드 링크 설정
        setDownloadURL(URL.createObjectURL(userVideoFinalBlob));
      };
    } catch (error) {
      console.log(error);
      alert("오디오를 추가할 수 없습니다.");
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
      <PracticeModeButton src={learnMode} onClick={goToLearnMode}></PracticeModeButton>
      <UserVideoContainer ref={userVideoRef} autoPlay playsInline></UserVideoContainer>
      <RecordButtonContainer>
        {mediaRecorder && (
          <RecordButton onClick={stopRecording}>
            <img src={stop} width="40px" height="40px"></img>
          </RecordButton>
        )}
        {!mediaRecorder && (
          <RecordButton onClick={startRecording}>
            <img src={start} width="80px" height="80px"></img>
          </RecordButton>
        )}
      </RecordButtonContainer>
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

const RecordButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RecordButton = styled.button`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: white;
`;

const PracticeModeButton = styled.img`
  width: 32px;
  height: 32px;
  background-color: white;
  border-radius: 6px;
  padding: 4px 8px;
  margin-left: -140px;
  z-index: 10;
  position: absolute;
`;

export default ChallengePage;
