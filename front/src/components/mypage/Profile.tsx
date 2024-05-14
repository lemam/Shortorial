import { useEffect, useState } from "react";
import styled from "styled-components";
import { Countings, getCounting } from "../../apis/mypage";

export default function Profile() {
  const [counting, setCounting] = useState<Countings>();

  const getCounts = async () => {
    try {
      const data = await getCounting();
      setCounting(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getCounts();
  }, []);
  return (
    <ProfileContainer>
      <ProfileInfoContainer>Profile 지역</ProfileInfoContainer>
      <ProfileNumContainer>
        <div>
          <div>{counting?.tryShortsCount}</div>
          <div>참여</div>
        </div>
        <div>
          <div>{counting?.uploadShortsCount}</div>
          <div>저장</div>
        </div>
        <div>
          <div>{counting?.youtubeUrlCount}</div>
          <div>업로드</div>
        </div>
      </ProfileNumContainer>
    </ProfileContainer>
  );
}
const ProfileContainer = styled.div`
  display: flex;
  height: 100%;
  border: 1px solid black;
  flex-direction: column; /* 세로로 나열 */
`;
const ProfileInfoContainer = styled.div`
  display: flex;
  border: 1px solid black;
`;
const ProfileNumContainer = styled.div`
  display: flex;
  border: 1px solid black;
`;
