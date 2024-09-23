import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { CancelPresentation, Copyright, EmojiPeople, MusicNote, TimerOutlined } from "@mui/icons-material";
import { useInView } from "react-intersection-observer";

import Header from "../components/header/Header";
import ShortsVideoItem from "../components/shorts/ShortsVideoItem";
import ShortsCard from "../components/shorts/ShortsCard";
import { PaginationShorts, RecomShorts, Shorts } from "../constants/types";
import { getRecommendedShorts, getTopRankingShorts, getTryCount, getShortsList } from "../apis/shorts";
import { Card, CardSubTitleSkeleton, CardTitleSkeleton, CardVideoSkeleton } from "../components/shorts/style";

const MainPage = () => {
  const [shortsList, setShortsList] = useState<Shorts[]>([]);
  const [popularShortsList, setPopularShortsList] = useState<Shorts[]>([]);
  const [recommendedShorts, setRecommendedShorts] = useState<RecomShorts[]>([]);

  const [ref, inView] = useInView({ threshold: 0.5 });
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [selectedShorts, setSelectedShorts] = useState<Shorts | RecomShorts | null>(null);

  const navigate = useNavigate();

  // page 별 쇼츠 리스트 가져오기
  const loadShortsList = async (page: number) => {
    setIsLoading(true);
    const data: PaginationShorts = await getShortsList(page);
    setShortsList(prev => [...prev].concat(data.contents));
    setIsLastPage(data.isLastPage);
    setIsLoading(false);
  };

  // 인기 쇼츠 리스트 가져오기
  const loadPopularShortsList = async () => {
    const data = await getTopRankingShorts();
    if (data) setPopularShortsList(data);
  };

  // 추천 쇼츠 리스트 가져오기
  const loadRecommendedShortsList = async () => {
    const data = await getRecommendedShorts();
    if (data) setRecommendedShorts(data);
  };

  const openModal = (shorts: Shorts | RecomShorts) => {
    return () => {
      setSelectedShorts(shorts);
      setShowDetails(true);
    };
  };

  const closeModal = () => {
    setShowDetails(false);
    setSelectedShorts(null);
  };

  const goToLearnMode = (shortsNo: number) => {
    getTryCount(shortsNo);
    navigate(`/learn/${shortsNo}`);
  };

  const goToChallengeMode = (shortsNo: number) => {
    getTryCount(shortsNo);
    navigate(`/challenge/${shortsNo}`);
  };

  // 인기, 추천 쇼츠 리스트 조회
  useEffect(() => {
    loadPopularShortsList();
    loadRecommendedShortsList();
  }, []);

  // '둘러보기' 섹션에서 무한 스크롤 실행
  useEffect(() => {
    if (inView && !isLoading) {
      loadShortsList(page);
      setPage(prev => prev + 1);
    }
  }, [inView, isLoading, page]);

  /*
  FIXME: 작은 화면에서는 무한스크롤 ref가 너무 내려가 스켈레톤이 100% 보이는 구간도 있음
  (https://www.notion.so/20240921-UI-108a5c5b6556809ebbe6c7b1509b356f#108a5c5b655680da907be3314688b8d5)
  */

  return (
    <Container>
      <Header />
      <SectionWrapper>
        {recommendedShorts.length > 0 && (
          <SeriesSection style={{ background: "#fefae0" }}>
            <SectionHeaderContainer>
              <SectionTitle>⭐ 이런 챌린지는 어떠세요?</SectionTitle>
              <p>당신이 좋아할 만한 챌린지를 추천해드릴게요.</p>
            </SectionHeaderContainer>
            <SectionConents className="nowrap">
              {recommendedShorts.map(shorts => (
                <ShortsVideoItem
                  key={shorts.shortsNo}
                  shortsInfo={shorts}
                  isLoading={isLoading}
                  isSerise
                  onClick={openModal(shorts)}
                ></ShortsVideoItem>
              ))}
            </SectionConents>
          </SeriesSection>
        )}
        {popularShortsList.length > 0 && (
          <SeriesSection style={{ background: "#ffe5ec" }}>
            <SectionHeaderContainer>
              <SectionTitle>🔥 요즘 이 챌린지가 가장 인기 있어요</SectionTitle>
              <p>{`숏토리얼에서 최근 가장 인기가 많은 챌린지들을 소개합니다.\n지금 바로 유행에 동참하세요!`}</p>
            </SectionHeaderContainer>
            <SectionConents className="nowrap">
              {popularShortsList.map(shorts => (
                <ShortsVideoItem
                  key={shorts.shortsNo}
                  shortsInfo={shorts}
                  isLoading={isLoading}
                  isSerise
                  onClick={openModal(shorts)}
                />
              ))}
            </SectionConents>
          </SeriesSection>
        )}
        <Section>
          <SectionTitle>둘러보기</SectionTitle>
          <SectionConents>
            {shortsList.map(shorts => (
              <ShortsCard key={shorts.shortsNo} shortsInfo={shorts} />
            ))}
            {!isLastPage &&
              [...new Array(5)].map((_, idx) => (
                <Card key={idx}>
                  <CardVideoSkeleton />
                  <CardTitleSkeleton />
                  <CardSubTitleSkeleton />
                </Card>
              ))}
            {!isLastPage && !isLoading && (
              <div
                ref={ref}
                style={{
                  position: "absolute",
                  bottom: "30px",
                  height: "400px",
                  width: "100%",
                  backgroundColor: "rgba(255, 0, 0, 0.3)",
                }}
              />
            )}
          </SectionConents>
        </Section>
      </SectionWrapper>
      {showDetails && selectedShorts && (
        <Modal>
          <CancelIcon>
            <CancelPresentation onClick={closeModal} fontSize="large" />
          </CancelIcon>
          <Details>
            <Detail text={selectedShorts.shortsTitle} fontWeight="bold" fontSize="23px"></Detail>
            <div>
              <Detail icon={<MusicNote />} text={`${selectedShorts.musicName}`} fontSize="18px"></Detail>
              <Detail icon={<TimerOutlined />} text={`${selectedShorts.shortsTime}초`} fontSize="18px"></Detail>
              <Detail
                icon={<EmojiPeople />}
                text={`${selectedShorts.shortsChallengers}명의 챌린저`}
                fontSize="18px"
              ></Detail>
              <Detail icon={<Copyright />} text={selectedShorts.shortsDirector} fontSize="18px"></Detail>
            </div>
          </Details>
          <ButtonContainer>
            <RouteButton onClick={() => goToLearnMode(selectedShorts.shortsNo)}>연습모드</RouteButton>
            <RouteButton onClick={() => goToChallengeMode(selectedShorts.shortsNo)}>챌린지모드</RouteButton>
          </ButtonContainer>
        </Modal>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Section = styled.section`
  position: relative;
  margin: 16px;
  box-sizing: border-box;
`;

const SectionWrapper = styled.div`
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  padding-top: 70px;
`;

const SectionTitle = styled.h3`
  font-size: 22px;
  font-weight: bold;
  margin: 1rem;
  margin-left: calc(var(--grid-item-margin) / 2);
`;

const SectionConents = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;

  &.nowrap {
    justify-content: center;
  }
`;

const SeriesSection = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: #ededed;
  border-radius: 16px;
  padding: 36px;
  margin: 48px 16px;

  @media screen and (max-width: 1024px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const SectionHeaderContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-right: 16px;
  word-break: keep-all;
  white-space: pre-line;

  h3 {
    margin: 1rem 0;
  }

  @media screen and (max-width: 1024px) {
    margin: calc(var(--grid-item-margin) / 2);
  }
`;

const pulse = keyframes`
  0% { 
    transform: translate(-50%, -50%) scale(1); 
  }
  50% { 
    transform: translate(-50%, -50%) scale(1.1); 
  }
  100% { 
    transform: translate(-50%, -50%) scale(1); 
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1;
  padding: 20px;
  width: 50%;
  animation: ${pulse} 0.5s ease-in-out;

  @media (max-width: 700px) {
    width: 60%;
  }
`;

const CancelIcon = styled.div`
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
`;

const Details = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
`;

interface DetailType {
  text?: string;
  fontSize?: string;
  fontWeight?: string;
  icon?: JSX.Element;
}

const Detail = ({ icon, text, fontSize, fontWeight }: DetailType) => {
  return (
    <div style={{ fontSize: fontSize, fontWeight: fontWeight, margin: "5px 0px" }}>
      {icon} {text}
    </div>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;

  @media (max-aspect-ratio: 1/1) {
    flex-direction: column;
    padding: 0px 25px;
  }
`;

const RouteButton = styled.button`
  border: 2px solid #fb2576;
  border-radius: 10px;
  background-color: white;
  color: black;
  padding: 10px 20px;
  cursor: pointer;
  margin: 5px;

  &:hover {
    background-color: #d3d3d3;
  }
`;

export default MainPage;
