import { useRef, useState } from "react";

import { Card, CardVideo, CardTitle, CardSubTitle, CardVideoSkeleton } from "./style";
import { Shorts } from "../../constants/types";

interface ShortsCardProps {
  shortsInfo: Shorts;
}

const ShortsCard = ({ shortsInfo }: ShortsCardProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleClick = () => {
    alert("모달이 열립니다.");
  };

  // 영상에 마우스 올리면 재생되도록 하는 거 만드는 중
  // 근데 사용자 인터렉션 없이 재생하는 거 안 됨
  // mute하면 해결할 수 있다.
  // 이후 mute를 store에서 통합 관리해서 다른 곳에서 음소거를 해제하면 계속 유지되도록 하자.
  // 미리보기는 전체는 아니고 5초 후에 멈추는 걸로 하자.
  const hanldeMouseEnter = () => {
    videoRef.current?.play();
    console.log(shortsInfo.shortsTitle);
  };

  // 마우스를 떼면 0초로 돌아가는 기능 추가
  const handleMouseLeave = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <Card onClick={handleClick} onMouseEnter={hanldeMouseEnter} onMouseLeave={handleMouseLeave}>
      {isLoading && <CardVideoSkeleton />}
      <CardVideo
        muted
        src={shortsInfo.shortsLink}
        crossOrigin="anonymous"
        onLoadedData={() => setIsLoading(false)}
        style={{ display: `${isLoading ? "none" : "inline"}` }}
        ref={videoRef}
      ></CardVideo>
      <CardTitle>{shortsInfo.shortsTitle}</CardTitle>
      <CardSubTitle>챌린저 {shortsInfo.shortsChallengers}명</CardSubTitle>
    </Card>
  );
};

export default ShortsCard;
