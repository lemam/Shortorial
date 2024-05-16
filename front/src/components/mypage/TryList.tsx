import { useEffect, useState } from "react";
import TryComponent from "./TryComponent";
import { shorts } from "../../apis/shorts";
import { getTryShorts } from "../../apis/mypage";
import styled from "styled-components";

export default function TryList() {
  const [shortsList, setShortsList] = useState<shorts[]>([]);
  const [isPortrait, setIsPortrait] = useState<boolean>(window.innerHeight > window.innerWidth);

  const getShorts = async () => {
    try {
      const data = await getTryShorts();
      setShortsList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getShorts();
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {Array.from(
        { length: Math.ceil(shortsList.length / (isPortrait ? 2 : 4)) },
        (_, index) => index * (isPortrait ? 2 : 4)
      ).map((startIndex) => (
        <div key={startIndex}>
          <div style={{ display: "flex" }}>
            {shortsList.slice(startIndex, startIndex + (isPortrait ? 2 : 4)).map((uploadShorts) => (
              // <TryComponent shorts={uploadShorts} />
              <Video
                crossOrigin="anonymous"
                src={uploadShorts.shortsLink}
                controls
                key={uploadShorts.shortsLink} // 각 비디오에 고유한 키 부여
              ></Video>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const Video = styled.video`
  width: calc(100% / 4);

  @media screen and (orientation: portrait) {
    width: calc(100% / 2);
  }

  @media screen and (orientation: landscape) {
    width: calc(100% / 4);
  }
`;
