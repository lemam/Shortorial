import { useEffect, useState } from "react";
import { UploadShorts } from "../../apis/shorts";
import { getUploadedShorts } from "../../apis/mypage";
import ChallengeResultPage from "./ChallengeComponent";

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
      {Array.from({ length: Math.ceil(shortsList.length / 4) }, (_, index) => index * 4).map(
        (startIndex) => (
          <div key={startIndex}>
            {/* 4개씩 묶어서 렌더링 */}
            <div style={{ display: "flex" }}>
              {shortsList.slice(startIndex, startIndex + 4).map((uploadShorts) => (
                <ChallengeResultPage uploadShorts={uploadShorts} />
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
// const VideoContainer = styled.div`
//   display: flex;
//   // margin-right: 5px; /* 오른쪽 마진을 20px로 설정 */
//   padding: 5px; /* 오른쪽 마진을 20px로 설정 */
//   height: 100%;
//   border: 1px solid red;
//   flex-direction: column; /* 세로로 나열 */
// `;
