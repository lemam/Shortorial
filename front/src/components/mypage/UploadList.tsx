import { useEffect, useState } from "react";
import { UploadShorts, getUploadedShorts } from "../../apis/shorts";
import styled from "styled-components";

export default function UploadList() {
  const [shortsList, setShortsList] = useState<UploadShorts[]>([]);

  const getShorts = async () => {
    try {
      const data = await getUploadedShorts();
      setShortsList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getShorts();
  }, []);

  return (
    <div>
      <h1>UploadList 부분</h1>
      {Array.from({ length: Math.ceil(shortsList.length / 4) }, (_, index) => index * 4).map(
        (startIndex) => (
          <div key={startIndex}>
            {/* 4개씩 묶어서 렌더링 */}
            <div style={{ display: "flex" }}>
              {shortsList.slice(startIndex, startIndex + 4).map((uploadShorts) => (
                <VideoContainer
                  key={uploadShorts.uploadNo}
                  style={{ width: "25%" }}
                >
                  <video
                    src={uploadShorts.uploadUrl}
                    crossOrigin="anonymous"
                    style={{ width: "100%", height: "auto" }}
                  />
                  <div>{uploadShorts.uploadTitle}</div>
                </VideoContainer>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
const VideoContainer = styled.div`
  display: flex;
  // margin-right: 5px; /* 오른쪽 마진을 20px로 설정 */
  padding: 5px; /* 오른쪽 마진을 20px로 설정 */
  height: 100%;
  border: 1px solid red;
  flex-direction: column; /* 세로로 나열 */
`;
