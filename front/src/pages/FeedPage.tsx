import { useEffect, useState } from "react";
import { Shorts } from "../constants/types";
import { axios } from "../utils/axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const FeedPage = () => {
  const navigate = useNavigate();

  const [shortsList, setShortsList] = useState<Shorts[]>([]);

  const goToLearnMode = (shortNo: number) => {
    navigate(`/learn/${shortNo}`);
  };

  const goToChallengeMode = (shortNo: number) => {
    navigate(`/challenge/${shortNo}`);
  };

  useEffect(() => {
    axios
      .get<Shorts[]>("/api/shorts")
      .then((response) => {
        setShortsList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

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
      <ShortsDetailContainer>
        {shortsList.map((shorts) => (
          <VideoItem key={shorts.shortsNo}>
            <VideoBox>
              <video src={shorts.shortsLink} crossOrigin="anonymous" controls />
            </VideoBox>
            <DetailItem>
              <Label>제목</Label>
              <Value>{shorts.shortsTitle}</Value>
            </DetailItem>
            <DetailItem>
              <Label>챌린저</Label>
              <Value>{shorts.shortsDirector}</Value>
            </DetailItem>
            <DetailItem>
              <Label>시간</Label>
              <Value>{shorts.shortsTime}</Value>
            </DetailItem>
            <DetailItem>
              <Label>참여 인원</Label>
              <Value>{shorts.shortsChallengers}</Value>
            </DetailItem>
            <ButtonList>
              <Button variant="secondary" onClick={() => goToLearnMode(shorts.shortsNo)}>
                연습 모드
              </Button>
              <Button variant="primary" onClick={() => goToChallengeMode(shorts.shortsNo)}>
                챌린지 모드
              </Button>
            </ButtonList>
          </VideoItem>
        ))}
      </ShortsDetailContainer>
    </Container>
  );
};

export default FeedPage;

// Component 로 나중에 빼자
const Header = styled.header`
  width: 100%;
  background-color: #f8f9fa;
  padding: 10px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  //   & > * {
  //     margin-bottom: 50px;
  //   }
`;
const ShortsDetailContainer = styled.div`
  @media (orientation: landscape) {
  }
`;

const VideoBox = styled.div`
  position: relative;
  width: 100%;
  max-width: 286px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (orientation: landscape) {
    video {
      width: 60%;
      height: 60%;
      object-fit: cover;
    }
  }
`;

const VideoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%; // 비디오 박스의 최대 너비를 고려
  padding: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// // 쇼츠 제목
// const VideoTitle = styled.div`
//   font-weight: bold;
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
// //   margin-bottom: 10px;
// `;

// const ButtonList = styled.div`
//   button{
//     margin: 0 10px;
//   }
// `

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  width: 100%;
  padding: 2px 40px;
  //   background-color: #f4f4f4;
  //   border-bottom: 1px solid #ddd;
  font-size: 16px;

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  font-weight: bold;
  margin-right: 10px;
  min-width: 100px; // 최소 너비 설정
`;

const Value = styled.span`
  flex-grow: 1;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ButtonList = styled.div`
  display: flex;
  justify-content: center;
  padding: 5px;

  button {
    margin: 0 10px;
    padding: 8px 20px;
  }
`;
