import { useState } from "react";
import Profile from "../components/mypage/Profile";
import UploadList from "../components/mypage/UploadList";
import styled from "styled-components";
import TryList from "../components/mypage/TryList";

export default function MyPage() {
  const [currentTab, clickTab] = useState(0);

  const menuArr = [
    { name: "업로드", content: <UploadList /> },
    { name: "참여", content: <TryList /> },
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

const TabMenu = styled.div`
  font-weight: bold;
  display: flex;
  flex-direction: row;
  align-items: center;
  list-style: none;
  // margin-bottom: 7rem;
  margin-top: 10px;

  text-align: center;

  .submenu {
    // 기본 Tabmenu 에 대한 CSS를 구현
    display: flex;
    justify-content: center;
    heigth: 30px;
    width: calc(100% / 2);
    padding-bottom: 5px;
    font-size: 15px;
    transition: 0.5s;
    border-bottom: 2px solid #c7c7c7;
  }

  .focused {
    //선택된 Tabmenu 에만 적용되는 CSS를 구현
    border-bottom: 2px solid #fb2576;
  }
`;
