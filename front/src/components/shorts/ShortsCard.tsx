import { useRef, useState } from "react";
import { VolumeUpRounded, VolumeOffRounded } from "@mui/icons-material";

import useShortsVideoStore from "../../store/useShortsVideoStore";
import {
  Card,
  CardVideo,
  CardTitle,
  CardDesc,
  CardVideoSkeleton,
  CardVideoContainer,
  SoundButton,
  Gradient,
} from "./style";
import { Shorts } from "../../constants/types";

interface ShortsCardProps {
  shortsInfo: Shorts;
  handleOpenModal: () => void;
}

const ShortsCard = ({ shortsInfo, handleOpenModal }: ShortsCardProps) => {
  const { isMuted, toggleMute } = useShortsVideoStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 클릭했을 때 모달을 띄우기 위한 메소드
  // 모달을 띄울 때 영상을 멈추게 한다.
  const openModal = () => {
    handleOpenModal();
    pauseVideo();
  };

  // 영상에 마우스가 들어오면 영상 재생을 시작한다.
  const playVideo = () => {
    videoRef.current?.play();
  };

  // 영상에서 마우스를 떼면 재생된 영상을 초기화한다.
  const pauseVideo = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <Card onMouseEnter={playVideo} onMouseLeave={pauseVideo}>
      {isLoading && <CardVideoSkeleton />}
      <CardVideoContainer style={{ display: `${isLoading ? "none" : "inline"}` }}>
        <div onClick={openModal}>
          <CardVideo
            muted={isMuted}
            src={shortsInfo.shortsLink}
            crossOrigin="anonymous"
            onLoadedData={() => setIsLoading(false)}
            ref={videoRef}
          ></CardVideo>
        </div>
        <Gradient />
        <SoundButton className="hover-opacity" onClick={toggleMute}>
          {isMuted ? <VolumeOffRounded /> : <VolumeUpRounded />}
        </SoundButton>
      </CardVideoContainer>
      <div onClick={openModal}>
        <CardTitle>{shortsInfo.shortsTitle}</CardTitle>
        <CardDesc>챌린저 {shortsInfo.shortsChallengers}명</CardDesc>
      </div>
    </Card>
  );
};

export default ShortsCard;
