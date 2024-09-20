import { useEffect, useState } from "react";

import { Card, CardVideo, CardTitle, CardSubTitle } from "./style";
import { Shorts } from "../../constants/types";

interface ShortsCardProps {
  shortsInfo: Shorts;
}

const ShortsCard = ({ shortsInfo }: ShortsCardProps) => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    console.log("isLoading", isLoading);
  }, [isLoading]);

  const handleClick = () => {
    alert("모달이 열립니다.");
  };

  return (
    <Card onClick={handleClick}>
      {isLoading && <div>로딩 중이예요</div>}
      <CardVideo src={shortsInfo.shortsLink} crossOrigin="anonymous" onLoadedData={() => setLoading(false)}></CardVideo>
      <CardTitle>여기에 제목이 나옵니다.여기에 제목이 나옵니다.여기에 제목이 나옵니다.</CardTitle>
      <CardSubTitle>여기 챌린저 수가 나옵니다.</CardSubTitle>
    </Card>
  );
};

export default ShortsCard;
