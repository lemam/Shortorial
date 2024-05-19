import { useEffect, useState } from "react";
import styled from "styled-components";
import { Countings, getCounting } from "../../apis/mypage";
import { MemberInfo, getInfo } from "../../apis/member";

export default function Profile() {
  const [counting, setCounting] = useState<Countings>();
  const [memberInfo, setMemberInfo] = useState<MemberInfo>();
  let imageUrl = "/src/assets/profiles/profile";
  const getCounts = async () => {
    try {
      const data = await getCounting();
      setCounting(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getMemberInfo = async () => {
    try {
      const data = await getInfo();
      setMemberInfo(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getCounts();
    getMemberInfo();
    if (memberInfo) {
      imageUrl = `${imageUrl}${memberInfo.memberProfile}.jpeg`;
    }
  }, []);

  return (
    <ProfileContainer>
      <ProfileNumContainer key="memberNickname">{memberInfo?.memberNickname}</ProfileNumContainer>
      <ProfileNumContainer key="tryShorts">
        <div>{counting?.tryShortsCount}</div>
        <div>참여</div>
      </ProfileNumContainer>
      <ProfileNumContainer key="uploadShorts">
        <div>{counting?.uploadShortsCount}</div>
        <div>완료</div>
      </ProfileNumContainer>
      <ProfileNumContainer key="youtubeUrl">
        <div>{counting?.youtubeUrlCount}</div>
        <div>게시</div>
      </ProfileNumContainer>
    </ProfileContainer>
  );
}
const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px;
  height: 100%;
  width: 100%;
  border: 1px solid black;
`;
const ProfileNumContainer = styled.div`
  display: flex;
  flex-direction: column; /* 세로로 나열 */
  justify-content: center; /* 수평 가운데 정렬 */
  align-items: center; /* 수직 가운데 정렬 */

  margin-right: 10px;
  margin-left: 10px;
`;
