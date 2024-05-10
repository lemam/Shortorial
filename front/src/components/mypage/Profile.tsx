import { useEffect, useState } from "react";
import styled from "styled-components";

export default function Profile() {
  return (
    <ProfileContainer>
      <ProfileInfoContainer>Profile 지역</ProfileInfoContainer>
      <ProfileNumContainer>
        <div>
          <div>숫자</div>
          <div>참여</div>
        </div>
        <div>
          <div>숫자</div>
          <div>저장</div>
        </div>
        <div>
          <div>숫자</div>
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
