import { useEffect, useState } from "react";
import styled from "styled-components";
import { Shorts } from "../constants/types";
import { getShortsInfo } from "../apis/shorts";
import Header from "../components/header/Header";
import ShortsVideoItem from "../components/shorts/ShortsVideoItem";

const MainPage = () => {
  const [shortsInfo, setShortsInfo] = useState<Shorts>();
  const [isLoading, setIsLoading] = useState(true);

  const loadShortsInfo = async () => {
    const data = await getShortsInfo(1 + "");
    if (data) {
      setShortsInfo(data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadShortsInfo();
  }, []);

  return (
    <Container>
      <Header />
      <Section>
        <SectionTitle>둘러보기</SectionTitle>
        <SectionConents>
          <ShortsVideoItem shortsInfo={shortsInfo} isLoading={isLoading} />
          <ShortsVideoItem shortsInfo={shortsInfo} isLoading={isLoading} />
          <ShortsVideoItem shortsInfo={shortsInfo} isLoading={isLoading} />
          <ShortsVideoItem shortsInfo={shortsInfo} isLoading={isLoading} />
          <ShortsVideoItem shortsInfo={shortsInfo} isLoading={isLoading} />
        </SectionConents>
      </Section>
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
  margin-top: 76px;
  box-sizing: border-box;
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
  width: 100%;
`;

export default MainPage;
