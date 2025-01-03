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
  // mute를 store에서 통합 관리해서 다른 곳에서 음소거를 해제하면 계속 유지
  const { isMuted, toggleMute } = useShortsVideoStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleClick = () => {
    pauseVideo();
    alert("모달이 열립니다.");
  };

  // 영상에 마우스 올리면 재생
  const hanldeMouseEnter = () => {
    videoRef.current?.play();
  };

  // 마우스를 떼면 0초로 돌아가는 기능 추가
  const pauseVideo = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <Card onMouseEnter={hanldeMouseEnter} onMouseLeave={pauseVideo}>
      {isLoading && <CardVideoSkeleton />}
      <CardVideoContainer>
        <div onClick={handleClick}>
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
      <div onClick={handleClick}>
        <CardTitle>{shortsInfo.shortsTitle}</CardTitle>
        <CardSubTitle>챌린저 {shortsInfo.shortsChallengers}명</CardSubTitle>
      </div>
    </Card>
  );
};

export default ShortsCard;
