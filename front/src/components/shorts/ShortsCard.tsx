import { useRef, useState } from "react";
import { VolumeUpRounded, VolumeOffRounded } from "@mui/icons-material";

import useShortsVideoStore from "../../store/useShortsVideoStore";
import {
  Card,
  CardVideo,
  CardTitle,
  CardSubTitle,
  CardVideoSkeleton,
  CardVideoContainer,
  SoundButton,
  Gradient,
} from "./style";
import { Shorts } from "../../constants/types";

interface ShortsCardProps {
  shortsInfo: Shorts;
}

const ShortsCard = ({ shortsInfo }: ShortsCardProps) => {
  const { isMuted, toggleMute } = useShortsVideoStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const openModal = () => {
    pauseVideo();
    alert("모달이 열립니다.");
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
      <CardVideoContainer>
        <div onClick={openModal}>
          <CardVideo
            muted={isMuted}
            src={shortsInfo.shortsLink}
            crossOrigin="anonymous"
            onLoadedData={() => setIsLoading(false)}
            style={{ display: `${isLoading ? "none" : "inline"}` }}
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
        <CardSubTitle>챌린저 {shortsInfo.shortsChallengers}명</CardSubTitle>
      </div>
    </Card>
  );
};

export default ShortsCard;
