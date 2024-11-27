import { useState } from "react";

import { Card, CardVideo, CardTitle, CardSubTitle, CardVideoSkeleton } from "./style";
import { Shorts } from "../../constants/types";

interface ShortsCardProps {
  shortsInfo: Shorts;
}

const ShortsCard = ({ shortsInfo }: ShortsCardProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleClick = () => {
    alert("모달이 열립니다.");
  };

  return (
    <>
      <Card onClick={handleClick}>
        {isLoading && <CardVideoSkeleton />}
        <CardVideo
          src={shortsInfo.shortsLink}
          crossOrigin="anonymous"
          onLoadedData={() => setIsLoading(false)}
          style={{ display: `${isLoading ? "none" : "inline"}` }}
        ></CardVideo>
        <CardTitle>{shortsInfo.shortsTitle}</CardTitle>
        <CardSubTitle>챌린저 {shortsInfo.shortsChallengers}명</CardSubTitle>
      </Card>
    </>
  );
};

export default ShortsCard;
