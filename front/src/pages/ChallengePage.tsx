import { useCallback, useRef, useState, useEffect } from "react";
import styled from "styled-components";
import danceVideo from "../assets/sample.mp4";
import { useNavigate } from "react-router-dom";
import useChallengeStore from "../store/useChallengeStore";

const ChallengePage = () => {
  const navigate = useNavigate();
  const { setDownloadURL } = useChallengeStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [videoURL, setVideoURL] = useState<string>("");

  const setCamera = useCallback(async () => {
    const constraints: MediaStreamConstraints = {
      video: true,
      audio: false,
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (error) {
      alert("카메라 권한을 찾을 수 없습니다.");
      console.error("Media device access error:", error);
    }
  }, []);

  useEffect(() => {
    setCamera();
  }, [setCamera]);

  const startRecording = () => {
    const constraints: MediaStreamConstraints = {
      video: true,
      audio: true,
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
        const recorder = new MediaRecorder(stream);
        const chunks: BlobPart[] = [];
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/mp4" });
          const url = URL.createObjectURL(blob);
          setVideoURL(url);
          setDownloadURL(url);
          stream.getTracks().forEach((track) => track.stop());
          navigate("/challenge/result");
        };
        recorder.start();
        setMediaRecorder(recorder);
      })
      .catch((err) => {
        console.error("Error accessing media devices.", err);
      });
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
  };

  return (
    <ChallengeContainer>
      <VideoContainer src={danceVideo} controls></VideoContainer>
      <VideoContainer ref={videoRef} autoPlay playsInline></VideoContainer>
      <RecordButtonContainer>
        <RecordButton onClick={startRecording}>Start Recording</RecordButton>
        <RecordButton onClick={stopRecording} disabled={!mediaRecorder}>
          Stop Recording
        </RecordButton>
        <RecordButton>
          {videoURL && (
            <a href={videoURL} download="recorded_video.mp4">
              Download Video
            </a>
          )}
        </RecordButton>
      </RecordButtonContainer>
    </ChallengeContainer>
  );
};

const VideoContainer = styled.video`
  height: 100vh;
  aspect-ratio: 9 / 16;
  object-fit: cover;
`;

const ChallengeContainer = styled.div`
  display: flex;
  justify-content: center;
  background-color: black;
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
`;

export default ChallengePage;
