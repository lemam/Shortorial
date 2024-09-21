import { useState } from "react";

import {
  Card,
  CardVideo,
  CardTitle,
  CardSubTitle,
  CardVideoSkeleton,
  CardTitleSkeleton,
  CardSubTitleSkeleton,
} from "./style";
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
        {isLoading && (
          <>
            <CardVideoSkeleton />
            {/* NOTE: 이 컴포넌트가 만들어졌다는 것은 이미 shortsInfo가 있다는 가정 하이다.
                      그렇기 때문에 이 스켈레톤들은 메인페이지에서 불러와야할 것 같다.
            */}
            {/* NOTE: 위의 문제를 해결하면 type에서 shortsChallengers의 undefined 타입도 삭제할 것 */}
            {shortsInfo.shortsTitle === "" && <CardTitleSkeleton />}
            {shortsInfo.shortsChallengers === undefined && <CardSubTitleSkeleton />}
          </>
        )}
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
