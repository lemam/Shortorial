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
      <ProfileInfoContainer>
        <div>
          <ProfileImage
            src={`/src/assets/profiles/profile${memberInfo?.memberProfile}.jpeg`}
            alt="프로필 이미지"
          />
        </div>
        <div>{memberInfo?.memberNickname}</div>
      </ProfileInfoContainer>

      <ProfileNumContainer>
        <div
          key="tryShorts"
          className="innerDiv"
        >
          <div>{counting?.tryShortsCount}</div>
          <div>참여</div>
        </div>
        <div
          key="uploadShorts"
          className="innerDiv"
        >
          <div>{counting?.uploadShortsCount}</div>
          <div>완료</div>
        </div>
        <div
          key="youtubeUrl"
          className="innerDiv"
        >
          <div>{counting?.youtubeUrlCount}</div>
          <div>게시</div>
        </div>
      </ProfileNumContainer>
    </ProfileContainer>
  );
}

const ProfileContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column; /* 세로로 나열 */
  border: 1px solid black;
  padding: 10px;
`;
const ProfileInfoContainer = styled.div`
  display: flex;
  justify-content: center; /* 수평 가운데 정렬 */
  align-items: center; /* 수직 가운데 정렬 */
  padding: 10px;
`;
const ProfileImage = styled.img`
  height: 50px;
  padding-right: 50px;
`;
const ProfileNumContainer = styled.div`
  display: flex;
  justify-content: center;
  border-top: 1px solid black;
  padding: 10px;

  .innerDiv {
    display: flex;
    flex-direction: column; /* 세로로 나열 */
    justify-content: center; /* 수평 가운데 정렬 */
    align-items: center; /* 수직 가운데 정렬 */

    width: 20vw;

    margin-right: 10px;
    margin-left: 10px;
  }
`;
