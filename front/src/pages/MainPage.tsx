import { useEffect, useState } from "react";
import { Shorts } from "../constants/types";
import { axios } from "../utils/axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();

  const goToDetail = (shortNo: number) => {
    navigate(`/shorts/${shortNo}`);
  };

  const [shortsList, setShortsList] = useState<Shorts[]>([]);

  useEffect(() => {
    axios
      .get<Shorts[]>("/api/shorts")
      .then((response) => {
        setShortsList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <Container>
      <Header>Let's DANCE</Header>
      <GridContainer>
        {shortsList.map((shorts) => (
          <VideoItem key={shorts.shortsNo}>
            <VideoBox onClick={() => goToDetail(shorts.shortsNo)}>
              <video src={shorts.shortsLink} crossOrigin="anonymous"></video>
            </VideoBox>
            <VideoTitle>{shorts.shortsTitle}</VideoTitle>
          </VideoItem>
        ))}
      </GridContainer>
    </Container>
  );
};

export default MainPage;

// Component 로 나중에 빼자
const Header = styled.header`
  width: 100%;
  background-color: #f8f9fa;
  padding: 10px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Container = styled.div`
  box-sizing: border-box;
`;

const GridContainer = styled.div`
  position: relative;
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, 1fr);

  @media (orientation: landscape) {
    grid-template-columns: repeat(4, minmax(162px, 1fr));
  }
`;

const VideoItem = styled.div`
  display: flex;
  flex-direction: column;
  // align-items: center;
  width: 100%; // 비디오 박스의 최대 너비를 고려
  padding: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const VideoBox = styled.div`
  position: relative;
  width: 100%;
  max-width: 286px;
  border-radius: 8px;
  overflow: hidden;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// 쇼츠 제목
const VideoTitle = styled.div`
  font-weight: bold;
  white-space: nowrap; /* 줄 바꿈 방지 */
  overflow: hidden; /* 넘침 숨김 */
  text-overflow: ellipsis; /* 넘침시 생략 부호(...) 표시 */
`;
