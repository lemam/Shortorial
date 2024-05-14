import styled from "styled-components";
import heroImg from "/src/assets/landing/hero.jpg";
import Header from "../components/header/Header";

const LandingPage = () => {
  return (
    <div>
      <Header style={{ position: "fixed" }} />
      <HeroContainer>
        <HeroImg src={heroImg} alt="" />
        <HeroTextContainer>
          <h1 className="title">{`SHORTORIAL에서\n쉽고 빠르게\n챌린지에 도전하세요`}</h1>
          <h2>모션 인식 기반 댄스 챌린지 연습 서비스</h2>
        </HeroTextContainer>
      </HeroContainer>
    </div>
  );
};

const HeroTextContainer = styled.div`
  position: relative;

  & > * {
    word-break: keep-all;
    white-space: pre-wrap;
    text-align: center;
    line-height: 1.4;
    color: #fff;
  }

  h1 {
    font-size: 32px;
    font-weight: bold;
  }

  h2 {
    font-size: 18px;
  }
`;

const HeroImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
`;

const HeroContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

export default LandingPage;
