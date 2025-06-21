import { useMemo, useRef, useState } from "react";
import { VolumeUpRounded, VolumeOffRounded } from "@mui/icons-material";

import useShortsVideoStore from "../../store/useShortsVideoStore";
import * as S from "./style";
import { Shorts } from "../../constants/types";

interface ShortsCardProps {
  shortsInfo: Shorts;
  handleOpenModal: () => void;
}

const ShortsCard = ({ shortsInfo, handleOpenModal }: ShortsCardProps) => {
  const { isMuted, toggleMute } = useShortsVideoStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const videoId = useMemo(() => {
    const arr = shortsInfo.shortsUrl.split("/");
    return arr[arr.length - 1];
  }, [shortsInfo.shortsUrl]);

  // 영상에 마우스가 들어오면 영상 재생을 시작한다.
  const handleMouseEnter = () => {
    if (!isLoading) playVideo();
  };

  // 영상에서 마우스를 떼면 재생된 영상을 초기화한다.
  const handleMouseLeave = () => {
    if (!isLoading) pauseVideo();
  };

  // 클릭했을 때 모달을 띄우기 위한 메소드
  // 모달을 띄울 때 영상을 멈추게 한다.
  const openModal = () => {
    if (!isLoading) {
      handleOpenModal();
      pauseVideo();
    }
  };

  // 영상 재생
  const playVideo = () => {
    videoRef.current?.play();
  };

  // 영상 종료
  const pauseVideo = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <S.Card onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {isLoading && <S.CardVideoSkeleton />}
      <S.CardVideoContainer style={{ display: `${isLoading ? "none" : "block"}` }}>
        <S.CardVideoBox onClick={openModal}>
          <S.CardVideo
            muted={isMuted}
            src={shortsInfo.shortsLink}
            crossOrigin="anonymous"
            onLoadedData={() => setIsLoading(false)}
            poster={`https://img.youtube.com/vi/${videoId}/frame0.jpg`}
            ref={videoRef}
          ></S.CardVideo>
        </S.CardVideoBox>
        <S.Gradient />
        <S.SoundButton className="hover-opacity" onClick={toggleMute}>
          {isMuted ? <VolumeOffRounded /> : <VolumeUpRounded />}
        </S.SoundButton>
      </S.CardVideoContainer>
      <div onClick={openModal}>
        <S.CardTitle>{shortsInfo.shortsTitle}</S.CardTitle>
        <S.CardDesc>챌린저 {shortsInfo.shortsChallengers}명</S.CardDesc>
      </div>
    </S.Card>
  );
};

export default ShortsCard;
