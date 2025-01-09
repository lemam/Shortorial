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
  const [showThumbnail, setShowThumbnail] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseOver = () => {
    if (!isLoading) {
      setShowThumbnail(false);
      playVideo();
    }
  };

  const handleMouseOut = () => {
    if (!isLoading) {
      setShowThumbnail(true);
      pauseVideo();
    }
  };

  // 클릭했을 때 모달을 띄우기 위한 메소드
  // 모달을 띄울 때 영상을 멈추게 한다.
  const openModal = () => {
    if (!isLoading) {
      handleOpenModal();
      pauseVideo();
    }
  };

  /*
    마우스를 떼면 영상을 초기화시키는 기능이 멈추기만하고 화면이 그 시간대에 머물러 있는 문제가 있음
    로그를 통해 currentTime = 0 인 것을 확인했음
    시간은 0으로 잘 움직였지만, 그 화면이 랜더링되지 않은 것으로 추측함

    https://stackoverflow.com/questions/8402158/html5-video-javascript-controls-restart-video
    이 글을 통해 load() 라는 메소드를 알게 되었음
    사용하니 마우스를 떼면 영상이 멈추고 처음 화면이 잘 나타남
    다만 그 과정에서 깜빡임이 발생함

    역시 방법은 썸네일을 추가하는 것이다.
    평소에는 img로 가려놓고, 마우스가 들어왔을 때만 img를 투명화시킨다.
    마우스를 떼면 img를 다시 보여준다.
  */

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
    <Card onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      {isLoading && <CardVideoSkeleton />}
      <CardVideoContainer style={{ display: `${isLoading ? "none" : "inline"}` }}>
        <div onClick={openModal} style={{ width: "100%", aspectRatio: "9 / 16" }}>
          {/* 썸네일 */}
          <img
            src="https://img.youtube.com/vi/-jkcLE1Ticw/frame0.jpg"
            alt=""
            style={{
              position: "absolute",
              zIndex: "10",
              width: "100%",
              borderRadius: "12px",
              opacity: `${showThumbnail ? "1" : "0"}`,
            }}
          />
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
