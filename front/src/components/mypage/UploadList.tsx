import { useEffect, useState } from "react";
import { UploadShorts } from "../../apis/shorts";
import { getUploadedShorts } from "../../apis/mypage";
import styled from "styled-components";
import UploadComponent from "./UploadComponent";

export default function UploadList() {
  const [shortsList, setShortsList] = useState<UploadShorts[]>([]);
  const [isPortrait, setIsPortrait] = useState<boolean>(window.innerHeight > window.innerWidth);

  const getShorts = async () => {
    try {
      const data = await getUploadedShorts();
      setShortsList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteShort = (uploadNo: number) => {
    setShortsList((prevList) => prevList.filter((short) => short.uploadNo !== uploadNo));
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
          <Container style={{ display: "flex" }}>
            {shortsList.slice(startIndex, startIndex + (isPortrait ? 2 : 4)).map((uploadShorts) => (
              <UploadComponent
                key={uploadShorts.uploadNo}
                uploadShorts={uploadShorts}
                onDelete={handleDeleteShort}
              />
            ))}
          </Container>
        </div>
      ))}
    </div>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 50%;

  @media screen and (orientation: landscape) {
    width: calc(100% / 4);
  }
`;
