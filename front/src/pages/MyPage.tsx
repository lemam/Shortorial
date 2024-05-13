import { useState } from "react";
import Profile from "../components/mypage/Profile";
import UploadSnsList from "../components/mypage/UploadSnsList";
import UploadList from "../components/mypage/UploadList";
import styled from "styled-components";
import TryList from "../components/mypage/TryList";

export default function MyPage() {
  const [currentTab, clickTab] = useState(0);

  const menuArr = [
    { name: "저장한 영상", content: <UploadList /> },
    { name: "업로드한 영상", content: <UploadSnsList /> },
    { name: "시도한 영상", content: <TryList /> },
  ];

  const selectMenuHandler = (index: number) => {
    clickTab(index);
  };
  return (
    <ProfileContainer>
      <div>Header</div>
      <div>
        <Profile />
      </div>
      <div>
        <TabMenu>
          {menuArr.map((el, index) => (
            <li
              className={index === currentTab ? "submenu focused" : "submenu"}
              onClick={() => selectMenuHandler(index)}
            >
              {el.name}
            </li>
          ))}
        </TabMenu>
        <div>{menuArr[currentTab].content}</div>
      </div>
    </ProfileContainer>
  );
}
const ProfileContainer = styled.div`
  display: flex;
  margin-right: 20px; /* 오른쪽 마진을 20px로 설정 */
  margin-left: 20px; /* 왼쪽 마진을 20px로 설정 */
  height: 100%;
  border: 1px solid blue;
  flex-direction: column; /* 세로로 나열 */
`;

const TabMenu = styled.ul`
  background-color: #dcdcdc;
  color: rgb(232, 234, 237);
  font-weight: bold;
  display: flex;
  flex-direction: row;
  align-items: center;
  list-style: none;
  margin-bottom: 7rem;
  margin-top: 10px;

  .submenu {
    // 기본 Tabmenu 에 대한 CSS를 구현
    display: flex;
    /* justify-content: space-between;
    width: 380px;
    heigth: 30px; */
    width: calc(100% / 3);
    padding: 10px;
    font-size: 15px;
    transition: 0.5s;
    border-radius: 10px 10px 0px 0px;
  }

  .focused {
    //선택된 Tabmenu 에만 적용되는 CSS를 구현
    background-color: rgb(255, 255, 255);
    color: rgb(21, 20, 20);
  }

  & div.desc {
    text-align: center;
  }
`;
