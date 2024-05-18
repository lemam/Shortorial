import { useEffect, useState } from "react";
import styled from "styled-components";
import { Shorts } from "../constants/types";
import { getShortsList } from "../apis/shorts";
import Header from "../components/header/Header";
import ShortsVideoItem from "../components/shorts/ShortsVideoItem";

const MainPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [allShortsList, setAllShortsList] = useState<Shorts[]>();
  const [popularShortsList, setPopularShortsList] = useState<Shorts[]>();

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
        <Section>
          <SectionTitle>이 쇼츠에 도전해보세요!</SectionTitle>
          <SectionConents className="nowrap">
            {popularShortsList?.map((shorts) => (
              <ShortsVideoItem
                key={shorts.shortsNo}
                shortsInfo={shorts}
                isLoading={isLoading}
                isSerise
              />
            ))}
          </SectionConents>
        </Section>
        <Section>
          <SectionTitle>실시간 인기 쇼츠</SectionTitle>
          <SectionConents className="nowrap">
            {popularShortsList?.map((shorts) => (
              <ShortsVideoItem
                key={shorts.shortsNo}
                shortsInfo={shorts}
                isLoading={isLoading}
                isSerise
              />
            ))}
          </SectionConents>
        </Section>
        <Section>
          <SectionTitle>둘러보기</SectionTitle>
          <SectionConents>
            {allShortsList?.map((shorts) => (
              <ShortsVideoItem key={shorts.shortsNo} shortsInfo={shorts} isLoading={isLoading} />
            ))}
          </SectionConents>
        </Section>
      </SectionWrapper>
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
  width: 100%;

  &.nowrap {
    flex-wrap: nowrap;
  }
`;

export default MainPage;
