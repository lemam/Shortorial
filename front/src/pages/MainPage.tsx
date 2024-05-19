import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Shorts } from "../constants/types";
import { getShortsList, getTryCount } from "../apis/shorts";
import Header from "../components/header/Header";
import ShortsVideoItem from "../components/shorts/ShortsVideoItem";
import {
  CancelPresentation,
  Copyright,
  EmojiPeople,
  MusicNote,
  TimerOutlined,
} from "@mui/icons-material";

const MainPage = () => {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [selectedShorts, setSelectedShorts] = useState<Shorts | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [allShortsList, setAllShortsList] = useState<Shorts[]>();
  const [popularShortsList, setPopularShortsList] = useState<Shorts[]>();

  const openModal = (shorts: Shorts) => {
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

  // 둘러보기 쇼츠 리스트 가져오기
  const loadAllShortsList = async () => {
    const data = await getShortsList();
    if (data) setAllShortsList(data);
  };

  const loadPopularShortsList = async () => {
    const data = await getShortsList();
    if (data) setPopularShortsList([data[0], data[1], data[2]]);
  };

  useEffect(() => {
    loadAllShortsList();
    loadPopularShortsList();
  }, []);

  useEffect(() => {
    if (popularShortsList && allShortsList) {
      setIsLoading(false);
    }
  }, [allShortsList, popularShortsList]);

  return (
    <Container>
      <Header />
      <SectionWrapper>
        {/* <Section>
          <SectionTitle>오늘의 챌린지</SectionTitle>
          <div
            style={{
              display: "flex",
              backgroundColor: "#ededed",
              position: "relative",
              width: "100%",
              alignItems: "center",
              padding: "16px",
              borderRadius: "16px",
            }}
          >
            {allShortsList && (
              <>
                <div style={{ width: "260px" }}>
                  <video
                    style={{
                      width: "100%",
                      objectFit: "cover",
                      borderRadius: "12px",
                    }}
                    src={allShortsList[0].shortsLink}
                    crossOrigin="anonymous"
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    marginLeft: "16px",
                    flexDirection: "column",
                  }}
                >
                  <Details style={{ alignItems: "flex-start" }}>
                    <Detail
                      icon={<MusicNote />}
                      text={allShortsList[0].shortsTitle}
                      fontWeight="bold"
                      fontSize="30px"
                    ></Detail>
                    <Detail
                      icon={<Copyright />}
                      text={allShortsList[0].shortsDirector}
                      fontSize="20px"
                    ></Detail>
                    <Detail
                      icon={<TimerOutlined />}
                      fontSize="18px"
                      text={`${allShortsList[0].shortsTime}초`}
                    ></Detail>
                    <Detail
                      icon={<EmojiPeople />}
                      fontSize="18px"
                      text={`${allShortsList[0].shortsChallengers}명의 챌린저`}
                    ></Detail>
                  </Details>
                  <ButtonContainer>
                    <RouteButton onClick={() => goToLearnMode(allShortsList[0].shortsNo)}>
                      연습모드
                    </RouteButton>
                    <RouteButton onClick={() => goToChallengeMode(allShortsList[0].shortsNo)}>
                      챌린지모드
                    </RouteButton>
                  </ButtonContainer>
                </div>
              </>
            )}
          </div>
        </Section> */}
        <SeriesSection>
          <SectionHeaderContainer>
            <SectionTitle>당신을 위한 추천 챌린지</SectionTitle>
            <p>무언가의 설명...</p>
          </SectionHeaderContainer>
          <SectionConents className="nowrap">
            {popularShortsList?.map((shorts) => (
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
        <SeriesSection>
          <SectionHeaderContainer>
            <SectionTitle>실시간 인기 챌린지</SectionTitle>
            <p>무언가의 설명...</p>
          </SectionHeaderContainer>
          <SectionConents className="nowrap">
            {popularShortsList?.map((shorts) => (
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
        <Section>
          <SectionTitle>둘러보기</SectionTitle>
          <SectionConents>
            {allShortsList?.map((shorts) => (
              <ShortsVideoItem
                key={shorts.shortsNo}
                shortsInfo={shorts}
                isLoading={isLoading}
                onClick={openModal(shorts)}
              />
            ))}
          </SectionConents>
        </Section>
      </SectionWrapper>
      {showDetails && selectedShorts && (
        <Modal>
          <CancelIcon>
            <CancelPresentation onClick={closeModal} fontSize="large" />
          </CancelIcon>
          <Details>
            <Detail text={selectedShorts.shortsTitle} fontWeight="bold" fontSize="28px"></Detail>
            <div>
              <Detail
                icon={<Copyright />}
                text={selectedShorts.shortsDirector}
                fontSize="18px"
              ></Detail>
              <Detail icon={<TimerOutlined />} text={`${selectedShorts.shortsTime}초`}></Detail>
              <Detail
                icon={<EmojiPeople />}
                text={`${selectedShorts.shortsChallengers}명의 챌린저`}
              ></Detail>
            </div>
          </Details>
          <ButtonContainer>
            <RouteButton onClick={() => goToLearnMode(selectedShorts.shortsNo)}>
              연습모드
            </RouteButton>
            <RouteButton onClick={() => goToChallengeMode(selectedShorts.shortsNo)}>
              챌린지모드
            </RouteButton>
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
  display: flex;
  flex-wrap: wrap;
  /* width: 100%; */

  &.nowrap {
    flex-wrap: nowrap;
  }
`;

const SeriesSection = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background: #ededed;
  border-radius: 16px;
  border: 2px solid #333;
  padding: 16px;
  margin: 48px 16px;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const SectionHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  word-break: keep-all;

  h3 {
    margin: 1rem 0;
  }

  @media screen and (max-width: 768px) {
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
  height: 50%;
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
  height: 60%;
`;

interface DetailType {
  text?: string;
  fontSize?: string;
  fontWeight?: string;
  icon?: JSX.Element;
}

const Detail = ({ icon, text, fontSize, fontWeight }: DetailType) => {
  return (
    <div style={{ fontSize: fontSize, fontWeight: fontWeight }}>
      {icon} {text}
    </div>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 30px;

  @media (max-aspect-ratio: 1/1) {
    flex-direction: column;
    padding: 0px 25px;
  }
`;

const RouteButton = styled.button`
  border: 1px solid #fb2576;
  border-radius: 10px;
  background-color: white;
  color: black;
  padding: 8px;
  cursor: pointer;
  margin: 5px;
  width: 100%;

  &:hover {
    background-color: #d3d3d3;
  }
`;

export default MainPage;
