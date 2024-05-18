import { useEffect, useState } from "react";
import { Shorts } from "../constants/types";
import { axios } from "../utils/axios";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import { getTryCount } from "../apis/shorts";
import Header from "../components/header/Header";

const ShortsDetailPage = () => {
  const navigate = useNavigate();

  const goToLearnMode = () => {
    const shortsNo = parseInt(params.shortsNo || "", 10);
    if (!isNaN(shortsNo)) {
      getTryCount(shortsNo);
      navigate(`/learn/${shortsNo}`);
    }
  };

  const goToChallengeMode = () => {
    const shortsNo = parseInt(params.shortsNo || "", 10);
    if (!isNaN(shortsNo)) {
      getTryCount(shortsNo);
      navigate(`/challenge/${shortsNo}`);
    }
  };

  const params = useParams();

  const [shortsInfo, setShortsInfo] = useState<Shorts>();

  useEffect(() => {
    axios
      .get(`/api/shorts/${params.shortsNo}`)
      .then((response) => {
        setShortsInfo(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <Container>
      <Header></Header>
      <ShortsDetailContainer>
        <VideoBox src={shortsInfo?.shortsLink} crossOrigin="anonymous"></VideoBox>
        <DetailContainer>
          <DetailItem>
            <Label>제목</Label>
            <Value>{shortsInfo?.shortsTitle}</Value>
          </DetailItem>
          <DetailItem>
            <Label>챌린저</Label>
            <Value>{shortsInfo?.shortsDirector}</Value>
          </DetailItem>
          <DetailItem>
            <Label>시간</Label>
            <Value>{shortsInfo?.shortsTime}</Value>
          </DetailItem>
          <DetailItem>
            <Label>참여 인원</Label>
            <Value>{shortsInfo?.shortsChallengers}</Value>
          </DetailItem>
        </DetailContainer>
        <ButtonList>
          <Button variant="secondary" onClick={goToLearnMode}>
            연습 모드
          </Button>
          <Button variant="primary" onClick={goToChallengeMode}>
            챌린지 모드
          </Button>
        </ButtonList>
      </ShortsDetailContainer>
    </Container>
  );
};

export default ShortsDetailPage;

const Container = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
`;
const ShortsDetailContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const VideoBox = styled.video`
  height: 70%;
  width: 100%;
`;

const DetailContainer = styled.div`
  height: 30%;
  width: 100%;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
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
