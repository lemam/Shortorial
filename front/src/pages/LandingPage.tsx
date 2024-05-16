import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import heroImg from "/src/assets/landing/hero.jpg";
// import device from "/src/assets/landing/device3.png";
import deviceLandscape from "/src/assets/landing/device_landscape.png";
// import service from "/src/assets/landing/service.png";
import serviceLandscape from "/src/assets/landing/service_landscape.png";
import Header from "../components/header/Header";
import useLoginStore from "../store/useLoginStore";
import BasicButton from "../components/button/BasicButton";

const LandingPage = () => {
  const isLogin = useLoginStore((state) => state.getIsLogin());
  const navigate = useNavigate();

  // 로그인한 유저의 접근 막기
  useEffect(() => {
    if (isLogin) navigate("/main");
  }, [isLogin, navigate]);

  return (
    <Container>
      <Header style={{ position: "fixed" }} />
      <HeroContainer>
        <HeroImg src={heroImg} alt="" />
        <HeroTextContainer>
          <h1 className="title">{`SHORTORIAL에서\n쉽고 빠르게\n챌린지에 도전하세요`}</h1>
          <h2 className="subTitle">모션 인식 기반 댄스 챌린지 연습 서비스</h2>
        </HeroTextContainer>
        <BasicButton
          text="지금 시작하기"
          style={CTAButtonStyled}
          onClick={() => navigate("/main")}
        />
      </HeroContainer>
      <Section>
        <h1 className="title">{`숏토리얼과 함께라면 여기가 나만의 연습실`}</h1>
        <p className="subTitle">
          {`웹캠 또는 스마트폰 카메라 하나로\n언제 어디서나 챌린지를 연습해보세요.`}
        </p>
        <ImageContainer>
          <ServiceImg src={serviceLandscape} alt="" />
          <DeviceImg src={deviceLandscape} alt="" />
        </ImageContainer>
      </Section>
      <Section>
        <div>
          <h1 className="title">{`이제 멀리서 걸어오실 필요 없어요`}</h1>
          <p className="subTitle">{`춤추다가 걸어와서 버튼 누르고...\n이런 귀찮은 과정은 저희가 도와드릴게요.`}</p>
        </div>
        <ImageContainer>
          <ServiceImg src={serviceLandscape} alt="" />
          <DeviceImg src={deviceLandscape} alt="" />
        </ImageContainer>
        <div style={{ margin: "50px 0" }}>
          <p className="text">
            {`별다른 기기 부착 없이 카메라로 모션을 인식하여 멀리서도 버튼 조작이 가능해요.`}
          </p>
        </div>
      </Section>
    </Container>
  );
};

const CTAButtonStyled = {
  width: "auto",
  height: "auto",
  marginTop: "20px",
  padding: "11px 16px",
  fontSize: "17px",
  zIndex: "10",
};

const DeviceImg = styled.img`
  width: 100%;
  height: 100%;
`;

const ServiceImg = styled.img`
  position: absolute;
  top: 53%;
  left: 50%;
  width: 90%;
  border-radius: 1rem;
  box-shadow: 12px 12px 15px rgba(0, 0, 0, 0.3);
  transform: translate(-50%, -50%);
`;

const ImageContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Section = styled.section`
  position: relative;
  width: 300px;
  margin: 0 auto;
  padding-top: 100px;
  padding-bottom: 50px;
  box-sizing: border-box;
`;

const HeroTextContainer = styled.div`
  position: relative;
  z-index: 10;

  & > * {
    text-align: center;
    color: #fff;
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
  z-index: 10;
`;

const HeroContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  word-break: keep-all;
  white-space: pre-wrap;
  background-color: #f9f9f9;

  .title {
    font-size: 30px;
    font-weight: bold;
    line-height: 1.4;
    margin-bottom: 1rem;
  }

  .subTitle {
    font-size: 20px;
    line-height: 1.4;
  }

  .text {
    font-size: 18px;
    color: #333d4b;
    line-height: 1.4;
  }
`;

export default LandingPage;
